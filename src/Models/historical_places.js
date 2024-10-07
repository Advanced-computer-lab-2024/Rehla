const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historical_placesSchema = new Schema({
    Name: { 
        type: String, 
        required: true, 
        unique: true
     },

    Description : {
        type: String,
        required : true,
    },
    Pictures : {
        type: String,
       // required : true,
    },
    Location : {
        type: String,
        required : true,
    },
    Country : {
        type: String,
        required : true,
    },
    Opens_At : {
        type: String,
        required : true,
    },
    Closes_At : {
        type: String,
        required : true,
    },
    
    S_Ticket_Prices : {
        type: Number,
        required : true,
    },
    F_Ticket_Prices : {
        type: Number,
        required : true,
    },
    N_Ticket_Prices : {
        type: Number,
        required : true,
    },
    Created_By : {
        type : String ,
        required : true,
    },

},{ versionKey: false });
const Historical_Place = mongoose.model('historical_places', historical_placesSchema);
module.exports = Historical_Place;