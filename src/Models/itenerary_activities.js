const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itenerary_activitiesSchema = new Schema({
    Itinerary_Name: {
        type: String,
        required: true,
    },
    Activities: {
        type: String,
        required: true,
    },
},{ versionKey: false });

const itenerary_activities = mongoose.model('itenerary_activities', itenerary_activitiesSchema);
module.exports = itenerary_activities;