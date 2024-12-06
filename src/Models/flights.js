const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
    },
    Flight_Name: {
        type: String,
        required: true,
    },
    Price: {
        type: String,
        required: true,
    },
    Departure: {
        type: String,
        required: true,
    },
    Arrival: {
        type: String,
        required: true,
    },
    Duration: {
        type: String,
        required: true,
    },
}, { versionKey: false });

const Flight = mongoose.model('flights', flightSchema);
module.exports = Flight;