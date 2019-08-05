const Auth = require('../models/auth.js')
const passport = require('passport')
const FacebookStrategy =require('passport-facebook').Strategy;
const {signRequestToken} = require('../routes/middlewares')
const {createResetPasswordToken} = require('../routes/redismethods.js')
const {sendConfirmMail} = require('../routes/mailMethods.js');

module.exports = {
  findAuth : (_id) => {
    return new Promise((resolve,reject) => {
      Auth.findOne({_id}).then((user)=>{
        console.log(9,user)
        resolve(user)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  resetPass : (authId,password) => {
    return new Promise(function(resolve,reject){
      Auth.updateOne({_id:authId},{
        emailProvider: {
          password: password
        }
      }).then(auth => {
        resolve()
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
          console.log("no user found for this email: "+email)
          resolve() //no user with this email
        }
        else{
          console.log(email+" -> "+user._id)
          resolve(user._id)
        }
      }).catch(err => {
        console.log("Error when retrieving userId for "+email,e);
        reject(err)
      })
    })
  },
  localAuth : (email, password, done) => {
      Auth.findOne({'$and' : [
          {email: email},
      ]}, {_id:1,emailProvider:1} , (err, auth)=>{
        if (err) done(err)
        if (!auth) {
              Auth.create({
                    email: email,
                    emailProvider : {password,verify:false}
              }).then(async (createdAuth)=>{
                console.log('HERE')
                try {
                  let passwordToken = await createResetPasswordToken(createdAuth._id)
                  await sendConfirmMail('vinologie.ovh',email,createdAuth._id,passwordToken)
                  console.log('DID SEND MSG')
                  done(null,null,"please verify")
                } catch (err) {
                  console.log(err)
                  done(err)
                }
              }).catch((error)=>{
                done(error)
              })
          } else if (!auth.emailProvider) {
              Auth.updateOne({email},{
                emailProvider: {
                      verify:false,
                      password
                }
              }).then(()=>{
                done(null,null,"please verify")
              }).catch((error)=>{
                done(error)
              })
          } else if (!auth.emailProvider.verify == true) {
            return done("not verified",null)
          } else {
            auth.comparePassword(password,(err,isMatch)=>{
              if(isMatch){
                return done(null,auth._id.toString())
              } else {
                return done('wrong password')
              }
            })
          }
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
