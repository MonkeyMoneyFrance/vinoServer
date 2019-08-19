const express=require('express');
const {user,auth,cellar,wine}=require('./core');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-token').Strategy;
const LocalStrategy = require('passport-local').Strategy;

dotenv.config();
const streams = require('./streams')
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const uuid = require('uuid/v4')
const {getClient,getResetPasswordToken,createResetPasswordToken,fetchQrCode,setQrCode,setDeviceToken,getDeviceToken,setSocketClient,removeSocketClient} = require('./routes/redismethods.js')
const {isAllowed,setMiddleWareClient,isAdmin} = require('./routes/middlewares.js');
const {sendResetPasswordMail} = require('./routes/mailMethods.js');
const {verifySocketToken} = require('./routes/socketmiddlewares.js');
const mongoose = require('mongoose')
const path = require('path')
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment')
const cors = require("cors")
const cron = require('node-cron');
const app = express();
const port = process.env.PORT || '3000'
const secretKey =  process.env.SECRETKEY || 'abcdefghijklmnopqrstuvwxyz'
const dbUser =  process.env.DBUSER || null
const dbPass = process.env.DBPASS || null
const dbCluster = process.env.DBCLUSTER || null

const connnectString =  "mongodb+srv://"+dbUser+":"+dbPass+"@"+dbCluster+".mongodb.net/test"

const http = require('http')
const server = http.createServer(app);
const io = require('socket.io')(server);
streams.setIo(io)
mongoose.connect(connnectString,
{
  useFindAndModify:false,
  useNewUrlParser: true,
  autoIndex:false,
  replicaSet:"Cluster0-shard-0",
  ssl: true,
  sslValidate: true,
})
.then(()=>{console.log('connected')})
.catch((e)=>console.log(e));


app.use(bodyParser.urlencoded({limit: '2mb', extended: true}))
app.use(bodyParser.json({limit: '2mb', extended: true}))
app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: new redisStore({ host: 'localhost', port: 6379, client: getClient(),ttl :  260}),
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))


if (process.env.NODE_ENV !== 'production') {
  app.use(cors({origin: 'http://localhost:8080', credentials: true }));
} else {
  app.use(express.static(path.resolve(__dirname,`../../dist`)))
  app.get(/^(?!\/api\/)/,(req,res) => {
    res.sendFile(path.resolve('index.html'))
  })
}
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback : true
  },
  auth.localAuth
));
passport.use(new GoogleStrategy({
    clientID: "492975335644-4okinlf94v3gfgjt4fjnbf8hlv5pt2uo.apps.googleusercontent.com",
    clientSecret: "7EvA0M2LEQ77_3P4_LMSf2Xz",
  },
  auth.googleAuth
));
passport.use(new FacebookTokenStrategy({
    clientID: 649559492141498,
    clientSecret: "59a21ce5eacfd0858a596df4eb19cc67",
    fbGraphVersion: 'v3.0'
  },auth.facebookAuth
))
passport.serializeUser((user, done) => {
  console.log(41,user)
  done(null, user)
})
passport.deserializeUser((user, done) => {
  console.log(44,user)
  done(null, user)
})

app.use(passport.initialize());
app.use(passport.session());




app.get('/api/authConnected',(req,res) => {
  if (req.isAuthenticated()){
    res.status(200).send({userId:req.user})
  } else {
    res.status(403).send({message:'UNAUTHENTICATED'})
  }

})

app.post('/api/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    if (req.user) res.status(200).send({userId : req.user});
    else res.status(401).send({'message':"Wrong Token"});
});
// , { scope: ["profile", "email"] })
app.post('/api/auth/google/token',
  passport.authenticate("google-token"),
  function (req, res) {
    if (req.user) res.status(200).send({userId : req.user});
    else res.status(401).send({'message':"Wrong Token"});
});
app.post('/api/auth/email/token', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { res.status(500).send(err) }
    else if (!user) {res.status(401).send({'message':"Wrong Token"})}
    else req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.status(200).send({userId : req.user});
    });
  })(req, res, next);
});

app.get('/api/askForConfirmation',function(req,res){
  let email = (req.query.email)
  auth.findEmail(req.query.email).then((id)=>{
    if (!id) return res.status(500).send('No user found')
    auth.askForConfirmation(req,id,email).then(()=>{
      res.status(200).send({message:'Email Sent'})
    })
  }).catch((err)=>{
    console.log(err)
    res.status(500).send(err)
  })
})


// all which is below this points need to pass token validation !
// app.use(function(req,res,next) {
//   verifyToken(req,res,next)
// }) // => must have a valid token !
app.post('/api/confirmMail',function(req,res){
  let {token,userId} = req.body
  getResetPasswordToken(userId).then((retrievedToken)=>{
    console.log()
    if (!retrievedToken || retrievedToken !== token) {
      return res.status(500).send('La requête a expiré. Veuillez recommencer la réinitialisation de mot de passe')
    }
    auth.confirmMail(userId).then(()=>{
      res.status(200).send("Votre compte est bien confirmé, vous pouvez fermer cette fenêtre.")
    }).catch((error)=>{
      res.status(200).send(error)
    })
  }).catch((error)=>{
    console.log(error)
    res.status(200).send(error)
  })
})
app.post('/api/askForReset',function(req,res){
  //body : email
  let email = req.body.email;
  auth.findEmail(email).then((userId)=>{                   //check mais / user exists
    if (!userId){
      res.status(404).send()
    }           //user doesn't exist
    else{
      createResetPasswordToken(userId).then(passwordToken=>{   //create token in redis, available 15 minutes
        sendResetPasswordMail(req.hostname,email,userId,passwordToken).then(()=>{                  //send the RESET mail, in which the token
          res.status(200).send({
            message:"resetPasswordToken sent by mail"
          });
        })
        .catch(e=>{
          res.status(500).send();   // couldn't send mail
        })
      })
      .catch(e=>{
        res.status(500).send();     // couldn't create token
      })
    }//end "userId retrieved for email"
  })
  .catch(e=>{
    res.status(404).send()      // user not found
  })
})


app.post('/api/newPassword',function(req,res){
  const {password1,userId,token} = req.body;
  getResetPasswordToken(userId).then((retrievedToken)=>{
    if (retrievedToken != token) {
      return res.send('La requête a expiré. Veuillez recommencer la réinitialisation de mot de passe')
    }
    auth.resetPass(userId,password1).then(()=>{
      res.send("Votre mot de passe a bien été modifié. Vous pouvez fermer cette fenêtre.")
    }).catch((error)=>{
      res.send(error)
    })
  }).catch((error)=>{
    res.send(error)
  })
})

// JUST NEED A VALID TOKEN HERE
app.use(function(req,res,next) {
  isAllowed(req,res,next)
}) // => must be either owner of info, or carer
app.get('/api/logout', function (req, res){
  req.logOut()  // <-- not req.logout();
  console.log('will send statuts logouted')
  res.status(200).send({message:'successfully logged out'})
});
// add one new aidant (need a valid token adn scanning fetchQRCODE)
app.post('/api/cellars/:cellarId?' , (req,res) => {
  cellar.set(req,req.body,req.params.cellarId)
  .then((response)=>{
    res.status(200).send(response)
  }).catch((error)=>{
    console.log(error)                          //mongoDB error => 500
    res.status(500).send({
      "message":"database error"
    })
  })
})

// FETCH ALL DEALING WITH TRAITEMENT
app.post('/api/deviceToken',(req,res) =>{
  getDeviceToken(req.decoded.userId).then(tokens => {
    if (tokens.indexOf(req.body.token) > -1) {
      res.status(200).send({"message":"already there"})
    } else {
      setDeviceToken(req.decoded.userId,req.body.token).then(()=>{
        res.status(200).send({"message":"token added"})
      }).catch((error) => {
        res.status(500).send({"message":"error on token addition"})
      })
    }
  })
})


app.get('/api/textSearch', (req,res) => {
  wine.textSearch(req,req.query.search)
  .then((response)=>{
    res.status(200).send(response)
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).send("There was a problem finding the wine , code : " + err)
  })
})

app.get('/api/wines/:wineId?', (req,res) => {

  wine.get(req,req.params.wineId)
  .then((response)=>{
    res.status(200).send(response)
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).send("There was a problem finding the wine , code : " + err)
  })
})
// delete specific medication (admin only)
app.delete('/api/wines/' , (req,res) => {
  wine.delete(req,req.body.wines || [])
  .then((response)=>res.status(200).send(response))
  .catch((err)=>{
    res.status(500).send("There was a problem adding the wine , code : " + err)})
})
app.put('/api/wines/' , (req,res) => {
  wine.move(req,req.body.wines || [])
  .then((response)=>res.status(200).send(response))
  .catch((err)=>{
    res.status(500).send("There was a problem adding the wine , code : " + err)})
})

// create medication (admin only)
app.post('/api/wines/:wineId?', (req,res) => {
  console.log(req.body)
  wine.set(req,req.body,req.params.wineId)
  .then((response)=>{
    // if (req.body.piture) {
    //   picture.set(req,response._id).then(()=>{
    //     res.status(200).send(response)
    //   }).catch((err)=>{
    //     res.status(200).send("There was a problem adding the photo , code : " + err)
    //   })
    // }
    // else {
      res.status(200).send(response)
    // }
  })
  .catch((err)=>{
    res.status(500).send("There was a problem adding the wine , code : " + err)})
}) // create new traitements for user => admin only

// app.post('users') add new user with id userId => admin
app.post('/api/user/:userId?', (req,res) => { // update user => admin/user/carer
  //&& !req.decoded.admin
  const userId = req.params.userId || req.decoded.userId  // if no params.userId => use token userId
  console.log(209,userId)
  user.set(req,userId,req.body)
  .then( user =>{
    if (!user){
      res.status(404).send({
        message:"User not found"
      })
    } else {
      res.status(200).send({
        message:"User updated",
        user:user
      })
    }
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).send({
      message:"There was a problem updating the user , code : " + err
    })
  })
})

app.get('/api/user/:userId?', (req,res) => { //get user infos => admin/user/carer
  //req.decoded.userId is supposed to exist here
  console.log(req.decoded)
  const userId = req.decoded.userId  // if no params.userId => use token userId
  auth.findAuth(userId)
  .then((response)=>{
    res.status(200).send(response)
  })
  .catch((err)=>{
    res.status(500).send("There was a problem find the user , code : " + err)})
})

// app.delete('users/:userId') delete user => admin
app.get('/api/cellars/:cellarId?' , (req,res) => { // get infos of all my patients / one particular patient
  cellar.get(req,req.params.cellarId)
  .then((response)=>{
    res.status(200).send(response)
  })
  .catch((err)=>{
    res.status(500).send("There was a problem registering the user , code : " + err)})
})

app.delete('/api/cellars/', (req,res) => { // delete a pairing

  cellar.delete(req,req.body.cellars || [])
  .then((response)=>{
    res.status(200).send(response)
  })
  .catch((err)=>{
    res.status(500).send("There was a deleting the cellar , code : " + err)
  })
})

app.use(function(req,res,next) {
  isAdmin(req,res,next)
}) // => must be either owner of info, or carer
app.post('/api/usersWithQrCode/', (req,res) => {
  user.create(req.body.users || "[]")
  .then(async (users)=>{
    let json = JSON.parse(JSON.stringify(users))
    for (var i in json){
      json[i].qrCodeId = await setQrCode(json[i]._id.toString(),res)
      if (i == Object.keys(json).length - 1) {
        res.status(200).send(json)
      }
    }
  })
  .catch((err)=>{
    res.status(500).send("There was a problem adding the users , code : " + err)})
})

server.listen(port ,()=>{
    console.log('laucnhed on port ' , port)
})


io.use(function(socket,next){
  verifySocketToken(socket,next)
}).on("connection", socket => {
  console.log('connected SOCKET')
  setSocketClient(socket.decoded.userId,socket.id).then(()=>{
    console.log(socket.id, " was added, user Id is : ", socket.decoded.userId)
  })
  // socket.on('user', (query) => {
  //   console.log(368,query)
  // });
  socket.on('disconnect', function() {
    let userId = socket.decoded.userId
    removeSocketClient(userId).then(()=>{
      console.log(userId, " was removed")
    })
  });
  // socket.on("disconnect", () => console.log("Client disconnected"));
});
