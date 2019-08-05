const express=require('express');
const {user,auth,cellar,wine}=require('./core');
const bodyParser = require('body-parser')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleStrategy = require('passport-google-token').Strategy;
const { facebook, google } = require('./configAuth');
const streams = require('./streams')
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const uuid = require('uuid/v4')
const {getClient,fetchQrCode,setQrCode,setDeviceToken,getDeviceToken,setSocketClient,removeSocketClient} = require('./routes/redismethods.js')
const {verifyToken,signRequestToken,isAllowed,setMiddleWareClient,isAdmin} = require('./routes/middlewares.js');
const {verifySocketToken} = require('./routes/socketmiddlewares.js');
const mongoose = require('mongoose')
const path = require('path')
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment')
const cors = require("cors")
const cron = require('node-cron');
const app = express();

const http = require('http')
const server = http.createServer(app);
const io = require('socket.io')(server);
streams.setIo(io)

mongoose.connect('mongodb+srv://mymac:weiH8ahb@cluster0-4wcde.mongodb.net/test', {useNewUrlParser: true,useFindAndModify:false}).then(()=>{
  console.log('connected')
}).catch((e)=>console.log(e));
// if (process.env.NODE_ENV !== 'production') {
//   app.use(cors({origin: 'http://localhost:8081', credentials: true }));
// } else {
//   app.use(express.static(path.resolve(__dirname,`../../dist`)))
//   app.get('/*',(req,res) => {
//     res.sendFile(path.resolve('index.html'))
//   })
// }

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

app.get('/authConnected',(req,res) => {
  if (req.isAuthenticated()){
    const token = signRequestToken({userId:req.user})
    res.status(200).send({token})
  } else {
    res.status(403).send({message:'UNAUTHENTICATED'})
  }

})

app.get('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    if (req.user) res.status(200).send({userId : req.user});
    else res.status(401).send({'message':"Wrong Token"});
});
// , { scope: ["profile", "email"] })
app.get('/auth/google/token',
  passport.authenticate("google-token"),
  function (req, res) {
    if (req.user) res.status(200).send({userId : req.user});
    else res.status(401).send({'message':"Wrong Token"});
});


// all which is below this points need to pass token validation !
// app.use(function(req,res,next) {
//   verifyToken(req,res,next)
// }) // => must have a valid token !


// JUST NEED A VALID TOKEN HERE
app.use(function(req,res,next) {
  console.log(req.isAuthenticated())
  isAllowed(req,res,next)
}) // => must be either owner of info, or carer
app.get('/logout', function (req, res){
  req.logOut()  // <-- not req.logout();
  console.log('will send statuts logouted')
  res.status(200).send({message:'successfully logged out'})
});
// add one new aidant (need a valid token adn scanning fetchQRCODE)
app.post('/cellars/:cellarId?' , (req,res) => {
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
app.post('/deviceToken',(req,res) =>{
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


app.get('/textSearch', (req,res) => {
  wine.textSearch(req,req.query.search)
  .then((response)=>{
    res.status(200).send(response)
  })
  .catch((err)=>{
    console.log(err)
    res.status(500).send("There was a problem finding the wine , code : " + err)
  })
})

app.get('/wines/:wineId?', (req,res) => {

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
app.delete('/wines/' , (req,res) => {
  wine.delete(req,req.body.wines || [])
  .then((response)=>res.status(200).send(response))
  .catch((err)=>{
    res.status(500).send("There was a problem adding the wine , code : " + err)})
})
app.put('/wines/' , (req,res) => {
  wine.move(req,req.body.wines || [])
  .then((response)=>res.status(200).send(response))
  .catch((err)=>{
    res.status(500).send("There was a problem adding the wine , code : " + err)})
})

// create medication (admin only)
app.post('/wines/:wineId?', (req,res) => {
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
app.post('/user/:userId?', (req,res) => { // update user => admin/user/carer
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

app.get('/user/:userId?', (req,res) => { //get user infos => admin/user/carer
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
app.get('/cellars/:cellarId?' , (req,res) => { // get infos of all my patients / one particular patient
  cellar.get(req,req.params.cellarId)
  .then((response)=>{
    res.status(200).send(response)
  })
  .catch((err)=>{
    res.status(500).send("There was a problem registering the user , code : " + err)})
})

app.delete('/cellars/', (req,res) => { // delete a pairing

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
app.post('/usersWithQrCode/', (req,res) => {
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

server.listen("3000"||process.env.PORT,()=>{
    console.log('done.....')
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
