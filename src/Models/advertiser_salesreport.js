const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Define the cart schema
const advertiser_salesreportSchema = new Schema({
 
  Email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Activity: {
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
  Report_no: {
    type: Number, 
    required: true, 
  }

},{ versionKey: false,timestamps: true });

// Create the model
const  advertiser_salesreport = mongoose.model("advertiser_salesreport",  advertiser_salesreportSchema);

module.exports = advertiser_salesreport;
