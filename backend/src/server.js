require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const cors = require('cors');//Allows us to make requests from different devices
const routes = require('./routes');
const app = express();

/**PAYPAL INTEGRATION */
const paypal = require('paypal-rest-sdk');

const PORT = 8080//process.env.PORT || 8000;

/*CONFIGURE PAYPAL CREDENTIALS */
paypal.configure({
  'mode':'sandbox', // sandbox or live
  'client_id' : process.env.CLIENT_ID,
  'client_secret' : process.env.CLIENT_SECRET,
});

//If we start the server from production
//if(process.env.NODE_ENV != 'production'){ require('dotenv').config()}

app.use(cors());
//Returns a middleware that passes  JSON as a response
app.use(express.json());

try {
  mongoose.connect(process.env.MONGO_DB_CONNECTION, {useNewUrlParser : true, useUnifiedTopology : true});
  mongoose.set("useCreateIndex",true);
  console.log("CONNECTION!");
} catch (e) {
  console.log(e);
}
//Tell the server to host the files
app.use("/files",express.static(path.resolve(__dirname, "..","files")))
//Express will look for the middleware
app.use(routes);

app.listen(PORT, () =>{
  console.log(`Listenning on ${PORT}`);
})
module.exports = app;