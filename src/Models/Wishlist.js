const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const wishlistSchema = new Schema({
  Email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Productname: { 
    type: String, 
    required: true 
  },
  
},{ versionKey: false });

// Create the model
const wishlist = mongoose.model("wishlist", wishlistSchema);

module.exports = wishlist;
