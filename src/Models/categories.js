const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    Name : {
        Type: String,
        required: true,
    },
},{ versionKey: false });

const category = mongoose.model('categories', categoriesSchema);
module.exports = category;