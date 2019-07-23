const key = require('../key.js');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const Cellar = require('../models/cellar.js')
var client;
module.exports = {
  verifyToken : function(req,res,next){
    let token;
    try {

      token = req.headers.authorization.split(" ")[1]
      jwt.verify(token, key.tokenKey, function (err, decoded) {
          if (err) {
            console.log(err)
            return res.status(403).json({"status":403, "message": 'Unauthorized access.' })
          }
          // client.get("credChanged:"+decoded.userId, function(err, reply) {
          //   // redis => change pass DATE (expire in refreshToken)
          //   // try with request TOKEN =>
          //     // if jwt.issue (request or refresh) < user:changePassDate => ask for a refresh Token => will be the same => ask for login
          //     // if jwt.issue > user:changePassDate => was able to sign a new Request Or Refresh Token
          //
          //   if (reply == null || decoded.iat > reply){ // pas de trace de changement de pwd // ou alors le token a été emis après
              console.log(decoded)
              req.decoded = decoded;
              next();
            // } else {
            //   return res.status(401).json({"error": true, "message": 'Unauthorized access.' })
            // }

          // })

      })
    } catch(e){
      console.log(e)
      return res.status(403).send({
          "error": true,
          "message": 'No token provided.'
      });
    }
  },
  isAllowed: function(req,res,next){
    // let userId = (req.query || {}).userId
    // si userId est précisé => on cherche tous les patients de token userId (dont doit faire partie params.userId normalement)
    // sinon => on cherche tous les aidants de moi

    // next()
    // if (req.decoded.admin == true) {
    //   // req.cellars = [userId] // we are fetching himself
    //   req.cellars = []
    //   next()
    // }
    // else {
    //
      Cellar.find({userId:req.decoded.userId}).then((cellars) => {
        if (cellars == null ||cellars.length == 0) {
          req.cellars = []
          next()
        } else {
          let array = []
          for (var i in cellars){
            array.push(cellars[i]._id)
          }

          req.cellars = array
          console.log(req.cellars)
          next()
        }
      })

  },
  isAdmin: function(req,res,next){
    if (req.decoded.admin == true) {
      next()
    } else {
      return res.status(403).json({"status":403, "message": 'Unauthorized access.' })
    }
  },
  comparePassword : function(candidatePassword,password){
    return new Promise((resolve,reject)=>{
      bcrypt.compare(candidatePassword,password)
      .then( isMatch => {
        resolve(isMatch)
      })
      .catch(err => reject(err))
    })
  },
  hashPassword : function(password) {
    return new Promise((resolve,reject) => {
      bcrypt.hash(password,10).then((hashedPassword) => {
         resolve(hashedPassword);
     }).catch(err=>reject(err))
    })
  },
  signRequestToken : function(data) {
    return jwt.sign(data,key.tokenKey , { expiresIn: key.tokenLife});
  }
}
