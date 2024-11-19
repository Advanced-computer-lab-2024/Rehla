const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const cartSchema = new Schema({
  Email: { type: String, required: true, unique: true }, // User's email
  Products: [{ type: String, required: true }],         // Array of product names
  Quantities: [{ type: Number, required: true }]        // Array of quantities
},{ versionKey: false });

// Create the model
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
