const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transportationSchema = new Schema({
    
        Route_Number: {
            type: Number,
            required: true,
        },
    
        Advertiser_Name: {
            type: String,
            required: true,
        },
    
        Advertiser_Email: {
            type: String,
            required: true,
        },
    
        Advertiser_Phone: {
            type: String,
            required: true,
        },
    
        Pickup_Location: {
            type: String,
            required: true,
        },
    
        Dropoff_Location: {
            type: String,
            required: true,
        },
    
        Pickup_Date: {
            type: Date,
            required: true,
        },
    
        Pickup_Time: {
            type: String,
            required: true,
        },
    
        Droppff_Time: {
            type: String,
            required: true,
        },
    
        Avilable_Seats: {
            type: Number,
            required: true,
        },
    
        Price: {
            type: Number,
            required: true,
        },
    },{versionKey: false});

const Transportation = mongoose.model('Transportation', transportationSchema);
module.exports = Transportation;