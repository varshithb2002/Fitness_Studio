const express = require('express');
const multer = require('multer');
const uploadToS3 = require('./config/s3Upload');
const uploadConfig = require('./config/upload');

const paypal = require('paypal-rest-sdk');

//Middleware to import the routes and inject.
const routes = express.Router();
const UserController = require('./controllers/UserController');
const EventController = require('./controllers/EventController');
const DashboardController = require('./controllers/DashboardController');
const LoginController = require('./controllers/LoginController');
const RegistrationController = require('./controllers/RegistrationController');
const ApprovalController = require("./controllers/ApprovalController");
const RejectionController = require("./controllers/RejectionController");

//We pass specific config to multer saying ok I want to upload the files this way
// USE THIS FOR LOCAL IMPLEMENTATION const upload = multer(uploadConfig);

routes.get("/",(req,res)=>{
  res.send({status : 200, message : "CONNECTED!"});
});
routes.get("/status", (req,res)=>{
  res.status(200);
});
//  .:LOGIN:.
routes.post("/login", LoginController.store);

//  .:REGISTRATION:.
//Create a Registration
routes.post("/registration/:eventId", RegistrationController.create);
//Get registration by Id -> See the registration data and status
routes.get("/registration/:registration_id", RegistrationController.getRegistration);
routes.post("/registration/:registration_id/approvals", ApprovalController.approval);
routes.post("/registration/:registration_id/rejections", RejectionController.rejection);


//  .:DASHBOARD:.
routes.get("/dashboard", DashboardController.getAllEvents);
routes.get("/dashboard/:sport", DashboardController.getAllEvents);
routes.get("/event/:eventId", DashboardController.getEventById);
// Get the user events
routes.get("/user/events", DashboardController.getEventsByUserId );
// Get the user subscriptions
routes.get("/user/subscriptions",DashboardController.getUserSubscriptions);


//  .:EVENTS:.
routes.post("/event", uploadToS3.single("thumbnail"), EventController.createEvent);
routes.post("/event/:event_id/subscribe", EventController.addUserSubscription);
routes.post("/event/:event_id/unsubscribe", EventController.removeUserSubscription);
routes.delete("/event/:eventId", EventController.delete);

//  .:USER:.
routes.post('/user/register', UserController.createUser);
//app.post('/register', RegisterController.store)
routes.get('/user/:userId', UserController.getUserById);

// .: DUMMY PAYPAL PAYMENT METHOD TEST :.
routes.get('/payment',(req,res)=>{
  // We need to create a payment object
  let payment = {
    "intent" : "authorize",
    "payer" : {
      "payment_method" : "paypal",
    },
    "redirect_urls" : {
      "return_url" : "http://localhost:8080/success",
      "cancel_url" : "http://localhost:8080/err",
    },
    "transactions":[{
      "amount":{
        "total" : 20.00,
        "currency" : "USD"
      },
      "description": "a new dummy payment method",
    }]
  }

  // call the create Pay Method
  createPay(payment)
    .then( transaction =>{
      console.log(transaction);
      const id = transaction.id;
      const links = transaction.links;
      let counter = links.length;

      while(counter --){
        if(links[counter].method == 'REDIRECT'){
          // redirect to paypal where user approves the transaction
          return res.redirect(links[counter].href);
        }
      }

    }).catch( err =>{
      console.log(err);
      res.redirect('/err');
    });
});

// success page 
routes.get('/success' , (req ,res ) => {
  console.log(req.query); 
  res.json({message : "payment was success"}); 
});

// error page 
routes.get('/err' , (req , res) => {
  console.log(req.query); 
  res.json({message : "there was an error with the payment"}); 
});

// helper functions 
const createPay = ( payment ) => {
  return new Promise( ( resolve , reject ) => {
    paypal.payment.create(payment,((err,payment)=> err ? reject(err) : resolve(payment)));
  });
}	

module.exports = routes

