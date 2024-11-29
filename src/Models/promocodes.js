const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promocodesSchema = new Schema({
    Code: {
        type: String,
        required: true,
    },
    Discount: {
        type: Number,
        required: true,
    },
    Expiry: {
        type: Date,
        required: true,
    },
    CreatedBy: {
        type: String,
        required: true,
        default: "Admin",
    },
    type: {
        type: String,
        required: true,
    },
    Tourist_Email: {
        type: String,
        required: true,
        default: "All",
    },
},{ versionKey: false });

module.exports = mongoose.model('promocodes', promocodesSchema);