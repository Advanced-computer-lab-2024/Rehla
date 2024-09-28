const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tour_guidesSchema = new Schema({
    Username : {
        type: String,
        required : true,
    },

    Email : {
        type : String ,
        required : true,
    },

    Password : {
        type : String ,
        required : true,
    },

    Type : {
        type : String ,
        required : true,
        default : "TOUR_GUIDE"
    },

    Mobile_Number : {
        type : String ,
        required : true,
    },

    Experience : {
        type : Number,
        required : true,
    },

    Previous_work : {
        type : String ,
    },

},{ versionKey: false });


const tour_guide = mongoose.model('tour_guides', tour_guidesSchema);
module.exports = tour_guide;