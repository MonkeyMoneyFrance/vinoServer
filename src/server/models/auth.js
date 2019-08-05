const mongoose = require('mongoose'), Model = mongoose.model;
const auth = require('../schemas/auth.js')
const {hashPassword,comparePassword} = require('../routes/middlewares.js')

auth.pre('save', function (next) {
  if (!this.emailProvider) return next()
  hashPassword((this.emailProvider).password).then((hashedPassword) => {
      (this.emailProvider).password = hashedPassword;
      console.log(hashedPassword)
      next();
  }).catch(err => next(err))
})
auth.methods.comparePassword=function(candidatePassword,next){
  comparePassword(candidatePassword,(this.emailProvider || {}).password)
  .then(isMatch => {
    next(null,isMatch)
  })
  .catch(error => {
    console.log(error)
    next(error)
  })
}

module.exports = Model("Auth",auth)
