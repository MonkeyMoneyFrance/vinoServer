const Auth = require('../models/auth.js')
const passport = require('passport')
const FacebookStrategy =require('passport-facebook').Strategy;
const {signRequestToken} = require('../routes/middlewares')
const {createResetPasswordToken} = require('../routes/redismethods.js')
const {sendConfirmMail} = require('../routes/mailMethods.js');

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
  askForConfirmation : (req,id,email) => {
    return new Promise(async (resolve,reject) => {
      console.log(req.hostname,email,id)
      try {
        let passwordToken = await createResetPasswordToken(id)
        await sendConfirmMail(req.hostname,email,id,passwordToken)
        console.log('DID SEND MSG')
        resolve()
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  },
  confirmMail : (_id) => {
    return new Promise(function(resolve,reject){

      Auth.updateOne({_id : new  ObjectId(_id)},{
         '$set': {"emailProvider.verify" : true}
      }).then(update => {
        console.log(update)
        resolve()
      }).catch((err)=>{
        console.log("User not found, error: "+err)
        reject("User not found, error: "+err)
        return;
      })
    })
  },
  resetPass : (_id,password) => {
    return new Promise(function(resolve,reject){
      Auth.findOne({_id:new  ObjectId(_id)}).then(auth => {
        auth.emailProvider =  {...auth.emailProvider,password}
        auth.save(function(err){
          if(err) return reject(err)
          resolve();
        })
      }).catch((err)=>{
        console.log("User not found, error: "+err)
        reject("User not found, error: "+err)
        return;
      })
    })
  },
  findEmail : (email) => {
    return new Promise((resolve,reject) => {
      Auth.findOne({'$and' : [
        {email},
        {emailProvider : {$exists:true}}
      ] }).then((user)=>{
        if (user == null){
          resolve() //no user with this email
        }
        else{
          resolve(user._id)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  localAuth : (req, email, password, done) => {
      Auth.findOne({'$and' : [
          {email: email},
      ]}, {_id:1,emailProvider:1} , (err, auth) => {
        if (err) done(err)
        if (!auth && req.body && req.body.name) {
              Auth.create({
                  name : req.body.name,
                  email: email,
                  emailProvider : {password,verify:false}
              }).then(createdAuth=>{
                  self.askForConfirmation(req,createdAuth._id,email)
                  .then(()=>done("please verify",null,"please verify"))
                  .catch((err) => done(err))

              }).catch((error)=>{
                done(error)
              })
        } else if (auth && !auth.emailProvider && req.body && req.body.name) {
            auth.emailProvider =  {verify:false,password}
            auth.save(async (err) => {
              if(err) done(error)
              self.askForConfirmation(req,auth._id,email)
              .then(()=>done("please verify",null,"please verify"))
              .catch((err) => done(err))
            })
        } else if (auth && !auth.emailProvider) {
          return done("no linked account",null)
        } else if (auth && !auth.emailProvider.verify == true) {
          return !req.body || !req.body.name ? done("not verified") : done('unauthorized')
        } else if (auth && !req.body.name){
          auth.comparePassword(password,(err,isMatch)=>{
            if(isMatch){
              done(null,auth._id.toString())
            } else {
              done('wrong password')
            }
          })
        } else {
           done('unauthorized')
        }
      })

    },

    googleAuth : (accessToken, refreshToken, profile, done) => {
      console.log(accessToken, refreshToken, profile)
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
                }).then((createdAuth)=>{
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
                    }).then((createdAuth)=>{
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
