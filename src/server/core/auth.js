const Auth = require('../models/auth.js')
const passport = require('passport')
const FacebookStrategy =require('passport-facebook').Strategy;
const {signRequestToken} = require('../routes/middlewares')
module.exports = {
  findAuth : (_id) => {
    console.log('TRU TO FIND')
    return new Promise((resolve,reject) => {
      console.log('will find', _id )
      Auth.findOne({_id}).then((user)=>{
        console.log(9,user)
        resolve(user)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  googleAuth : (accessToken, refreshToken, profile, done) => {
      Auth.findOne({
            'email': profile.emails[0].value
      }, function(err, auth) {
        if (err) done(err)
        // no user was found, lets create a new one
        if (!auth) {
              Auth.create({
                    email: profile.emails[0].value,
                    name : profile.displayName,
                    googleProvider: {
                          id: profile.id,
                          token: accessToken
                    }
              },{new:true,upsert:true}).then((createdAuth)=>{
                // const token = signRequestToken({userId:createdAuth._id.toString()})
                done(null,createdAuth._id.toString())
                // resolve({...profile,token,userId:createdAuth._id.toString(),accessToken})
              }).catch((error)=>{
                done(error)
              })
        } else if (!auth.googleProvider) {

            Auth.updateOne({email:profile.emails[0].value},{
              googleProvider: {
                    id: profile.id,
                    token: accessToken
              }
            }).then(()=>{
              // const token = signRequestToken({userId:auth._id.toString()})
              done(null,auth._id.toString())
              // resolve({...profile,token,userId:auth._id.toString(),accessToken})
            }).catch((error)=>{
              done(error)
            })

        } else {
          // const token = signRequestToken({userId:auth._id.toString()})
          done(null,auth._id.toString())
          // resolve({...profile,token,userId:auth._id.toString(),accessToken})
        }
      });

  },
  facebookAuth : (accessToken, refreshToken, profile, done) => {
          Auth.findOne({
                'email': profile.emails[0].value
          }, function(err, auth) {
            if (err) done(err)
            // no user was found, lets create a new one
            if (!auth) {
                  Auth.create({
                      email: profile.emails[0].value,
                      name : profile.displayName,
                      facebookProvider: {
                            id: profile.id,
                            token: accessToken
                      }
                  },{new:true,upsert:true}).then((createdAuth)=>{
                    // const token = signRequestToken({userId:createdAuth._id.toString()})
                    done(null,createdAuth._id.toString())
                  }).catch((error)=>{
                    console.log(error)
                    done(error)
                  })
            } else if (!auth.facebookProvider) {

                Auth.updateOne({email:profile.emails[0].value},{
                  facebookProvider: {
                        id: profile.id,
                        token: accessToken
                  }
                }).then(()=>{
                  // const token = signRequestToken({userId:auth._id.toString()})
                  done(null,auth._id.toString())
                  // resolve({...profile,token,userId:auth._id.toString(),accessToken})
                }).catch((error)=>{
                  done(error)
                })

            } else {
              done(null,auth._id.toString())
            }
          });

  },
  delete : (email) => {
    return new Promise(function(resolve,reject){
      Auth.findOneAndRemove({email}).then((response)=>resolve(response))
      .catch((error)=>reject(error))
    })
  }



}
