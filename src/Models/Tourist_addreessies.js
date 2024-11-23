const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourist_addreessiesSchema = new Schema({
    Email: {
        type: String,
        required: true,
    },
    Address: {
        type: String,
        required: true,
    },
},{ versionKey: false });

module.exports = mongoose.model('tourist_addreessies', tourist_addreessiesSchema);