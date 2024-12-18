const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    Name: {
        type: String,
        required: true,
        unique : true,

    },
},{ versionKey: false });

const category = mongoose.model('categories', categoriesSchema);
module.exports = category;