const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertiser_activitiesSchema = new Schema({
    Email: {
        type : String ,
        required : true,
    },

    Activity_Name: {
        type : String ,
        required : true,
    },

    Location: {
        type : String ,
        required : true,
    },

    Date: {
        type : String ,
        required : true,
    },

    Available_Spots: {
        type : Number ,
        required : true,
    },

    Booked_Spots: {
        type : Number ,
        required : true,
    },
    
},{ versionKey: false });


const advertiser_activities = mongoose.model('advertiser_activities', advertiser_activitiesSchema);
module.exports = advertiser_activities;