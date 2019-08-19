const mongoose = require('mongoose'),
Schema = mongoose.Schema;
// ObjectId = Schema.Types.ObjectId;
//
module.exports = new Schema({
        name: String,
        email: {
            type: String,
            // required: true,
            trim: true,
            unique: true,
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        },
        facebookProvider: {
              type: {
                    id: String,
                    token: String
              },
              select: false
        },
        googleProvider: {
              type: {
                id: String,
                token: String
              },
              select: false
        },
        emailProvider: {
              type: {
                password: String,
                verify:Boolean
              },
              select: false
        }
  },{timestamps:true})
