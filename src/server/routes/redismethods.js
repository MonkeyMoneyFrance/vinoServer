const redis = require('redis');
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId;
const client = redis.createClient();
client.on('error', (err) => {
    console.log("Error " + err)
});
module.exports = {
  createResetPasswordToken : function(userId){
    let token = Math.random().toString(36).substr(2);
    return new Promise((resolve,reject) =>{
      client.set('resetPasswordTokenForUserId:'+userId,token,'EX', 1800 ,(err,reply)=>{
        if (err){
          console.log("error when assigning resetPasswordToken in Redis",{userId})
          reject(err)
        }
        else resolve(token)
      })
    })
  },
  getResetPasswordToken : function(userId){
    return new Promise((resolve,reject) =>{
      client.get('resetPasswordTokenForUserId:'+userId,(err,token)=>{
        if (err){
          console.log("error when fetching resetPasswordToken in Redis",{userId})
          reject(err)
        }
        else resolve(token)
      })
    })
  },
  fetchQrCode : function(id){
    return new Promise((resolve,reject) =>{
      client.get('qrCode:'+id,(err,reply)=>{
        if (err) {
          console.log("ERROR Redis: "+err)
          reject(err)
        } else {
          resolve(reply)
        }
      })
    })
  },
  setQrCode : function(id){
    let qrCodeId = objectId()
    return new Promise((resolve,reject) =>{
      client.set('qrCode:'+qrCodeId,id,(err,reply)=>{
        //differenciate internal error or existing qrCodeId ?
        if (err) reject(err)
        else resolve(qrCodeId)
      })
    })
  },
  getDeviceToken : function(userId,deviceToken){
    return new Promise((resolve,reject) =>{
      client.lrange('deviceToken:'+userId,-100, 100,(err,reply)=>{
        if (err) reject(err)
        else resolve(reply)
      })
    })
  },
  setDeviceToken : function(userId,deviceToken){
    return new Promise((resolve,reject) =>{
      client.rpush('deviceToken:'+userId,deviceToken,(err,reply)=>{
        //differenciate internal error or existing qrCodeId ?
        if (err) reject(err)
        else resolve(reply)
      })
    })
  },
  removeDeviceToken : function(userId,deviceToken = null) {
    return new Promise((resolve,reject) =>{
      if (!deviceToken){
        client.del('deviceToken:'+userId,(err,reply)=>{
          //differenciate internal error or existing qrCodeId ?
          if (err) reject(err)
          else resolve(reply)
        })
      } else {
        client.lrem('deviceToken:'+userId,0,deviceToken,(err,reply)=>{
          //differenciate internal error or existing qrCodeId ?
          if (err) reject(err)
          else resolve(reply)
        })
      }
    })
  },
  setSocketClient : function(userId,idSocket){
    return new Promise((resolve,reject) =>{
      client.set('socketio:'+userId,idSocket,(err,reply)=>{
        if (err) reject(err)
        else resolve()
      })
    })
  },
  removeSocketClient : function(userId){
    return new Promise((resolve,reject) =>{
      client.del('socketio:'+userId,(err,reply)=>{
        if (err) reject(err)
        else resolve()
      })
    })
  },
  getSocketClient : function(userId){
    return new Promise((resolve,reject) =>{
      client.get('socketio:'+userId,(err,reply)=>{
        if (err) reject(err)
        else resolve(reply)
      })
    })
  },
  getClient : () => client
}
