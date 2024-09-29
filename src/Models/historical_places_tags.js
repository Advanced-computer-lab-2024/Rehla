const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historical_places_tagsSchema = new Schema({
    Name : {
        Type: String,
        required: true,
    },
    Historical_Period : {
        Type: String,
        required: true,
    },
    Type : {
        Type: String,
        required: true,
    },
},{ versionKey: false });

const historical_places_tags = mongoose.model('historical_places_tags', historical_places_tagsSchema);
module.exports = historical_places_tags;