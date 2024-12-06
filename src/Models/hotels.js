const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
    },
    Hotel_Name: {
        type: String,
        required: true,
    },
    Hotel_Location: {
        type: String,
        required: true,
    },
    Check_In: {
        type: String,
        required: true,
    },
    Check_Out: {
        type: String,
        required: true,
    },
}, { versionKey: false });

const Hotel = mongoose.model('hotels', hotelSchema);
module.exports = Hotel;