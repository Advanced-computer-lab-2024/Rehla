const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itenerary_activitiesSchema = new Schema({
    Itinerary_Name : {
        Type: String,
        required: true,
    },
    Activities : {
        Type: String,
        required: true,
    },
},{ versionKey: false });

const itenerary_activities = mongoose.model('itenerary_activities', itenerary_activitiesSchema);
module.exports = itenerary_activities;