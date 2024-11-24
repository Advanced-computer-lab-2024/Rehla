const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const CartSchema = new Schema({
  Cart_Num:{
    type: Number, 
    
  },
  Email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Productname: { 
    type: String, 
    required: true 
  },
  Quantity: { 
    type: Number, 
    required: true ,
    default: 1
  }
},{ versionKey: false });

// Create the model
const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
