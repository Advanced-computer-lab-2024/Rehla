const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourist_activiesSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
    },

    
    Activity_Name: {
        type: String,
        required: true,
    },
    Attended: {
        type: Boolean,
        default: false,
    },

    Comment: {
        type: String,
        default: "No Comment",
    },
    Rating: {
        type: Number ,
        default: null,
    },
    Paid: {
        type: Boolean,
        default: false,
    },
    Date: {
        type: Date
    },S

},{ versionKey: false });

const tourist_activities = mongoose.model('tourist_activities', tourist_activiesSchema);
module.exports = tourist_activities;