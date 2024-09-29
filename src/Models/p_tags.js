const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const p_tagsSchema = new Schema({
    Name : {
        Type: String,
        required: true,
    },
},{ versionKey: false });

const p_tags = mongoose.model('p_tags', p_tagsSchema);
module.exports = p_tags;