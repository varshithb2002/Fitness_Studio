const mongoose = require('mongoose');

//In Mongoose, a virtual is a property that is not stored in MongoDB.
//Virtuals are typically used for computed properties on documents.
//We need to turnOn virtuals otherwise the virtuals won't be pase as JSON


const opts = { toJSON : { virtuals : true } };
const EventSchema = mongoose.Schema({
  title : String,
  description : String,
  price : Number,
  thumbnail : String,
  sport : String,
  date : Date,
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
  },
  usersSubscribed : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
  }],
},opts)
EventSchema.virtual("thumbnail_url").get(function(){
  return this.thumbnail;
})

module.exports = mongoose.model('Event', EventSchema)//Params : modelname, userschema
