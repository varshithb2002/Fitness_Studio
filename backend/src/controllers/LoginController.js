const User = require('../models/User');
const bcrypt = require('bcrypt')

module.exports = {
  async store(req,res){
    try {
      const {email,password} = req.body;
      if(!email || !password){
        //One field is missing
        return res.status(200).json({message : "Required field missing"});
      }
      const user = await User.findOne({email});
      if(!user){
        //The email is not register
        return res.status(200).json({message : "Email not found! Register instead?"})
      }

      if(user && await bcrypt.compare(password , user.password)){
        //Email and password are correct
        
        const userResponse = {
          _id : user._id,
          email : user.email,
          firstName : user.firstName,
          lastName : user.lastName,
        }
        return res.status(200).json(userResponse)
      }else{
        //EITHER the password or email are incorrect
        return res.status(200).json({message : "Email or password does not match"})
      }

    } catch (e) {
      throw Error(`Error while authenticating the user ${e}`)
    }
  }
}
