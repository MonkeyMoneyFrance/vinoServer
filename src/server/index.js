const express=require('express');
const mongoose = require('mongoose')
const {user,auth,cellar,wine}=require('./core');
const redis = require('redis');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const client  = redis.createClient();
const path = require('path')
const cors = require('cors')
const uuid = require('uuid/v4')
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.NODE_ENV || '3000'
mongoose.connect('mongodb+srv://mymac:weiH8ahb@cluster0-4wcde.mongodb.net/test', {useNewUrlParser: true,useFindAndModify:false}).then(()=>{
  console.log('connected')
}).catch((e)=>console.log(e));

app.use(bodyParser.urlencoded({limit: '2mb', extended: true}))
app.use(bodyParser.json({limit: '2mb', extended: true}))

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    auth.findAuth({email})
    .then(user => {
      if (!user) {
        return done(null, false, { message: 'Invalid credentials.\n' });
      }

      // if (!user.password || !bcrypt.compareSync(password, user.password)) {
      //   return done(null, false, { message: 'Invalid credentials.\n' });
      // }
      return done(null, user);
    }).catch(error => done(error));
  }
));
// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((_id, done) => {
  auth.findAuth({_id})
  .then(user => {
    if (!user) {
      return done(null, false, { message: 'Invalid credentials.\n' });
    }
    // if (!user.password || !bcrypt.compareSync(password, user.password)) {
    //   return done(null, false, { message: 'Invalid credentials.\n' });
    // }
    return done(null, user);
  }).catch(error => (error, false));
});


app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({origin: 'http://localhost:8080', credentials: true }));
} else {
  app.use(express.static(path.resolve(__dirname,`../..dist`)))
  app.get('/*',(req,res) => {
    res.sendFile(path.resolve('index.html'))
  })
}


app.post('/login', (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if(info) {return res.status(401).send({message:info.message})}
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      res.status(200).send({authenticated:'AUTHENTICATED',...req.session.passport.user})
    })
  })(req, res, next);
})

app.get('/authrequired', (req, res) => {
  res.status(req.isAuthenticated() ? 200 : 401).end()
})
app.get('/adminRequired', (req, res) => {
  let status = req.isAuthenticated() && req.session.passport.admin ? 200 : 401
  res.status(status).end()
})
app.get('/testAuth', (req, res) => {
  console.log(`User authenticated? ${req.isAuthenticated()}`)
  res.send({})
})
app.get('/', (req, res) => {
  console.log('is not auth')
  res.send({})
})
///////////////////////////
server.listen(port,()=>console.log("...listening HTTP on port 3000"));
