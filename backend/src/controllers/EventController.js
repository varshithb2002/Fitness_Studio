const Event = require('../models/Event');
const User = require('../models/User');

module.exports = {
  async createEvent (req,res){
    const { title, description, price, sport } = req.body;
    const { user_id } = req.headers;
    const { location } = req.file;

    const user = await User.findById(user_id);

    if(!user){
      return res.status(400).json({
        message : "User does not exists!"
      })
    }
    //Let's create the new event!
    const event = await Event.create({
      title,
      description,
      sport,
      price : parseFloat(price),
      user : user_id,
      //thumbnail is just ex-> josue-124124124.jpg (The name of the pic in the server)
      thumbnail : location,
      usersSubscribed : [],
    })

    return res.json(event);
  },

  async delete(req,res){
    const { eventId } = req.params;
    try {
      await Event.findByIdAndDelete(eventId)
      //204->  The server succesfully processed the request
      return res.status(204).json({message : "succesfully Deleted"})
    } catch (e) {
      return res.status(200).json({message : "We dont have any event with the ID"})
    }
  },
  async addUserSubscription(req,res){
    const { event_id } = req.params;
    const { user } = req.headers;
    try {
      const event = await Event.findById(event_id);
      if(event){
        event.usersSubscribed =[...event.usersSubscribed,user];
        await event.save();
        return res.status(200).json(event)
      }else{
        res.status(200).json({message : "The events doesn't exists anymore!"});
      }
    } catch (error) {
      res.status(202).json({message :  `Ops! ${error}!`});
    }

  }
  ,
  async removeUserSubscription(req,res){
    const { event_id } = req.params;
    const { user } = req.headers;
    try {
      const event = await Event.findById(event_id);
      if(event){
        // Return the same array but remove the user whois unsubscribing
        event.usersSubscribed =[...event.usersSubscribed].filter((userSubs)=> user != userSubs);
        await event.save();
        return res.status(200).json(event)
      }else{
        res.status(200).json({message : "The events doesn't exists anymore!"});
      }
    } catch (error) {
      res.status(202).json({message :  `Ops! ${error}!`});
    }

  }

}
