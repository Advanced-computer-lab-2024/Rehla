const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourist_itenerariesSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
    },

    
    Itinerary_Name: {
        type: String,
        required: true,
    },
    Attended: {
        type: Boolean,
        default: false,
    },

    Comment: {
        type: String,
        default: null,
    },
    Rating: {
        type: Number ,
        default: null,
    },
    
    Paid: {
        type: Boolean,
        default: false,
        required : true,
    },

},{ versionKey: false });

const tourist_iteneraries = mongoose.model('tourist_iteneraries', tourist_itenerariesSchema);
module.exports = tourist_iteneraries;