const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const museumsSchema = new Schema({
    Name : {
        type: String,
        required : true,
    },

    description : {
        type: String,
        required : true,
    },

    pictures : {
        type: String,
        required : true,
    },
    location : {
        type: String,
        required : true,
    },
    Country : {
        type: String,
        required : true,
    },

    Opening_Hours: {
        type: String,
        required : true,
    },

    S_Tickets_Prices : {
        type: Number,
        required : true,
    },
    F_Tickets_Prices : {
        type: Number,
        required : true,
    },
    N_Tickets_Prices : {
        type: Number,
        required : true,
    },
    Tag : {
        type: String,
        required : true,
    },

},{ versionKey: false });

const Museums = mongoose.model('Museums', museumsSchema);
module.exports = Museums;