const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the cart schema
const advertiser_salesreportSchema = new Schema({
    Email: { 
        type: String, 
        required: true, 
    },
    Activity: {
        type: String, 
        required: true,
    },
    Revenue: {
        type: Number, 
        required: true, 
    },
    Sales: {
        type: Number, 
        required: true, 
    },
    Price: {
        type: Number,
        required: true,
        default: null
    },
    Report_no: {
        type: Number, 
        required: true, 
    }
}, { timestamps: true });

// Create the model
const advertiser_salesreport = mongoose.model("advertiser_salesreport", advertiser_salesreportSchema);

module.exports = advertiser_salesreport;
