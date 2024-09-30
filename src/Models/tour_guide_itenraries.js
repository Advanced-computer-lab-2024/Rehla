const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tour_guide_itenerariesSchema = new Schema({
    TouGuide_Email : {
        type: String,
        required: true,
    },

    
    Itenerary_Name : {
        type: String,
        required: true,
    },
},{ versionKey: false });

const tour_guide_itenraries = mongoose.model('tour_guide_iteneraries', tour_guide_itenerariesSchema);
module.exports = tour_guide_itenraries;