const User = require('../models/User.js');
const bcrypt = require('bcrypt');

module.exports = {
  async createUser(req, res){
    try {
      const {firstName, lastName, password,email} = req.body;
      // Go to the db and check if the email is actually saved
      const existentUser = await User.findOne({email});

      if(!existentUser){
        //Hash password
        const hashedPassword = await bcrypt.hash(password,10)//2Param,howstrong
        //Shortcut to save fast to MongoDb a new collection
        const user = await User.create({
          firstName,
          lastName,
          email,
          password : hashedPassword,
        });
        //This returns a complete JSON of the typical MongoDb object
        return res.json({
          _id : user._id,
          email : user.email,
          firstName : user.firstName,
          lastName : user.lastName,
        })
      }
      //If there is a user send a 400 http status and a message
      return res.status(400).json({
        message : 'email/user already exists! Do you want to login instead?'
      });


    } catch (e) {
      throw Error(`Error while registering new user : ${e}`)
    }
  },

  async getUserById(req, res){
    //We get the value of the userId param
    const {userId} = req.params;

    try{
      const user = await User.findById(userId);//Search the user
      return res.json(user)
    }catch(e){
      //If the user was not found a 400 http status and a message
      return res.status(400).json({
        message : 'User ID doesnt exist, do you want to register instead'
      });
    }
  }
}
