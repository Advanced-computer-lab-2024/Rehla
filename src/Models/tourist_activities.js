const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourist_activiesSchema = new Schema({
    Tourist_Email : {
        type: String,
        required: true,
    },

    
    Itinerary_Name : {
        type: String,
        required: true,
    },
    Attended : {
        type: Boolean,
        default: no,
    },

    Comment : {
        type: String,
    },
    Rating : {
        type: Number ,
    },

},{ versionKey: false });

const tourist_activities = mongoose.model('tourist_activities', tourist_activiesSchema);
module.exports = tourist_activities;