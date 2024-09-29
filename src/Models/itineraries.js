const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itinerarysSchema = new Schema({
    Itinerary_Name : {
        type : String , 
        required : true,
    },

    Timeline : {
        type : String , 
        required : true ,
    },

    Duration : {
        type : String , 
        required : true ,
    },

    Language : {
        type : String , 
        required : true ,
    },

    Tour_Price: {
        type : Number , 
        required : true ,
    },

    Available_Date_Time : {
        type : Date , 
        required : true ,
    },

    Accessibility : {
        type : Boolean , 
        required : true ,
    },

    Pick_Up_Point : {
        type : String , 
        required : true ,
    },
    
    Drop_Of_Point : {
        type : String , 
        required : true ,
    },

    
    Booked: {
        type : Number , 
        required : true ,
    },

    
    Empty_Spots: {
        type : Number , 
        required : true ,
    },

    
    Country: {
        type : String , 
        required : true ,
    },
    Rating:{
        type:Number,
        required: true,
    }
    
},{ versionKey: false });

const itinerary = mongoose.model('Itinerary', itinerarysSchema);
module.exports = itinerary;