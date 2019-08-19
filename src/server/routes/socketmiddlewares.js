// const key = require('../key.js');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
var client;
module.exports = {
  verifySocketToken : function(socket, next){
    if (socket.handshake.query && socket.handshake.query.token){
      jwt.verify(socket.handshake.query.token, process.env.TOKENKEY, function(err, decoded) {
        if(err) {
          console.log('attempt to connect with wrong token')
          return next(new Error('Authentication error'));
        }
        socket.decoded = decoded;
        next();
      });
    } else {
        console.log('attempt to connect with no token')
        next(new Error('Authentication error'));
    }
  }
}
