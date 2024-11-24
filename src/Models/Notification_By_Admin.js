const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const Notification_ASchema = new Schema({
 
  Email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Type: {         //activity aw itenerary
    type: String, 
    required: true, 
    unique: true 
  },
  Name: {          //esm el activity ae itinerary
    type: String, 
    required: true, 
    unique: true 
  },
  Description : {   
    type: String, 
    required: true 
  },

},{ versionKey: false });

// Create the model
const  Notification_A = mongoose.model(" Notification_A",   Notification_ASchema);

module.exports =  Notification_A;
