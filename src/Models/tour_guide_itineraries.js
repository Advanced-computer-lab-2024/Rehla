const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tour_guide_itinerariesSchema = new Schema({
    Email : {
        type: String,
        required: true,
    },

    
    Itinerary_Name : {
        type: String,
        required: true,
    },
},{ versionKey: false });

const tour_guide_itineraries = mongoose.model('tour_guide_itineraries', tour_guide_itinerariesSchema);
module.exports = tour_guide_itineraries;