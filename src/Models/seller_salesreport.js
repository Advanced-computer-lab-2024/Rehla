const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const seller_salesreportSchema = new Schema({
 
  Email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Product: {
    type: String, 
    required: true, 
    unique: true 
  },
  Revenue:{
    type: Number, 
    required: true, 
  },
  Sales: {
    type: Number, 
    required: true, 
  },
  Price:{
    type: Number,
    required:true,
    default: null
  },
  Report_no: {
    type: Number, 
    required: true, 
  }

},{ versionKey: false ,timestamps: true});

// Create the model
const  seller_salesreport = mongoose.model("seller_salesreport",  seller_salesreportSchema);

module.exports = seller_salesreport;
