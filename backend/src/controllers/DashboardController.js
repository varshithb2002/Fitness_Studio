const Event = require('../models/Event')

module.exports = {
  async getAllEvents(req,res){
    const { sport } = req.params;
    //If the query is undefined pass an empty object
    try{

      if(sport){
        const events = await Event.find({sport : sport})
        return res.json(events)
      }
      //Passing {} we are saying to get all documents
      const events = await Event.find({});
      if(events){
        return res.json(events)
      }
    }catch(e){
      return res.status(400).json({message : "We don't have any events yet!"})
    }

  },
  async getEventById(req,res){
    const { eventId } = req.params;

    try{
      //Find the event by its ID in mongo
      const event = await Event.findById(eventId);
      if(event){
        return res.json(event)
      }
    }catch(e){
      return res.status(200).json({message : "EventId doesn't exist!"})
    }

  },
  async getEventsByUserId(req,res){
    const { user } = req.headers;

    try{
      //Find the event by its ID in mongo
      const userEvents = await Event.find({user});
      if(userEvents){
        return res.json(userEvents);
      }
    }catch(e){
      return res.status(200).json({message : `User -> ${user_id} does not have any event`});
    }

  },
  async getUserSubscriptions(req,res){
    const { user } = req.headers;
    try{
      //Find the events where the user is subscribed to
      const userEvents = await Event.find({usersSubscribed : user});
      if(userEvents){
        return res.json(userEvents);
      }
    }catch(e){
      return res.status(404).json({message : `User -> ${user_id} does not have any event`});
    }
  },
}
