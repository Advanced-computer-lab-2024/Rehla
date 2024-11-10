const mongoose = require('mongoose');
const Tourist = require('./tourists');
const Schema = mongoose.Schema;

const tourist_tranportationsSchema = new Schema({

    Tourist_Email: {
        type: String,
        required: true,
        ref: Tourist,
    },

    Route_Number: {
        type: Number,
        required: true,
    },

},{versionKey: false});

const Tourist_Tranportations = mongoose.model('Tourist_Tranportations', tourist_tranportationsSchema);
module.exports = Tourist_Tranportations;