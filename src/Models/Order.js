const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const OrderSchema = new Schema({
 
  Email: { 
    type: String, 
    required: true
  },
  Cart_Num:{
    type: Number, 
    
  },
  Status: { 
    type: String, 
    required: true,
    default: "Pending" 
  },
  Address: { 
    type: String, 
    required: true 
  },
  Payment_Method: {   // ya ema cash aw card
    type: String, 
    required: true 
  },

},{ versionKey: false });

// Create the model
const  Order = mongoose.model("Order",  OrderSchema);

module.exports = Order;
