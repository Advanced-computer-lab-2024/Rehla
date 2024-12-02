const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const CartSchema = new Schema({
  Cart_Num:{
    type: Number, 
    required: true, 
    
  },
  Email: { 
    type: String, 
    required: true, 
     
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
// Create a compound unique index on Cart_Num and Email
CartSchema.index({ Cart_Num: 1, Email: 1, Productname: 1 }, { unique: true });

// Create the model
const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
