const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitysSchema = new Schema({
    Name: {
        type : String ,
        required : true,
        unique : true,

    },

    Location: {
        type : String ,
        required : true,
    },

    Time: {
        type : String ,
        required : true,
    },

    Duration: {
        type : String ,
        required : true,
    },

    Price: {
        type : Number ,
        required : true,
    },

    Date: {
        type :  Date ,
        required : true,
    },

    Discount_Percent: {
        type : Number ,
        required : true,
    },

    Booking_Available: {
        type : Boolean,
        //required : true,
    },

    Available_Spots: {
        type : Number ,
        required : true,
    },

    Booked_Spots: {
        type : Number ,
        //required : true,
    },
    Rating: {
        type : Number ,
    },
    Created_By: {
        type : String ,
        required : true,
    },
    Flagged: {
        type : Boolean,
        default : false,
    },
    Picture:{
        type : String ,
        required : false,
        default : "No Picture"
    }


},{ versionKey: false });


const Activity = mongoose.model('Activity', activitysSchema);
module.exports = Activity;