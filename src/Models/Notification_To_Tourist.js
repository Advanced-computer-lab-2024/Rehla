const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const Notification_TSchema = new Schema({
 
  Email: { 
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
const  Notification_T = mongoose.model("Notification_T",  Notification_TSchema);

module.exports = Notification_T;
