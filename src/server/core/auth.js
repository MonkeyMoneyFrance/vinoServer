const Auth = require('../models/auth.js')
const passport = require('passport')
const FacebookStrategy =require('passport-facebook').Strategy;
const {signRequestToken} = require('../routes/middlewares')
module.exports = {
  findAuth : (req = {}) => {
    let {email,_id} = req
    return new Promise((resolve,reject) => {

      Auth.findOne({'$and':[
        email ? {email} : {},
        _id ? {_id} : {}
      ]}).then((user)=>{
        resolve(user)
      }).catch(err => {
        reject(err)
      })
    })
  },
  facebookAuth : (profile,accessToken) => {
    return new Promise((resolve,reject) => {
          Auth.findOne({
                'facebookProvider.id': profile.id
          }, function(err, auth) {
            if (err) reject(err)
            // no user was found, lets create a new one
            if (!auth) {
              console.log(profile)
                  Auth.create({
                        email: profile.emails[0].value,
                        // userId : userId,
                        name : profile.displayName,
                        facebookProvider: {
                              id: profile.id,
                              token: accessToken
                        }
                  },{new:true,upsert:true}).then((createdAuth)=>{
                    const token = signRequestToken({userId:createdAuth._id.toString()})
                    resolve({...profile,token,userId:createdAuth._id.toString(),accessToken})
                  }).catch((error)=>{
                    console.log(error)
                    reject(error)
                  })
            } else {
              const token = signRequestToken({userId:auth._id.toString()})
              resolve({...profile,token,userId:auth._id.toString(),accessToken})
            }
          });
    })
  },
  delete : (email) => {
    return new Promise(function(resolve,reject){
      Auth.findOneAndRemove({email}).then((response)=>resolve(response))
      .catch((error)=>reject(error))
    })
  }



}
