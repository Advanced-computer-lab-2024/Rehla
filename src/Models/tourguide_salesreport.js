const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const tourguide_salesreportSchema = new Schema({
 
  Email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Itinerary: {
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

},{ versionKey: false, timestamps: true });

// Create the model
const  tourguide_salesreport = mongoose.model("tourguide_salesreport",  tourguide_salesreportSchema);

module.exports = tourguide_salesreport;
