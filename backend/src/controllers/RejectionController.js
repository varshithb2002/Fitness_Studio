const Registration = require('../models/Registration');

module.exports= {
  async rejection(req,res){
    const {registration_id} = req.params;

    try {
      const registration = await Registration.findById(registration_id);

      registration.approved = false;
      await registration.save();
      return res.status(200).json(registration)
    } catch (e) {
      return res.status(400).json(e);
    }

  }
}
