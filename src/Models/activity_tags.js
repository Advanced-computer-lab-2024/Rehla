const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activity_tagsSchema = new Schema({
    Activity : {
        Type: String,
        required: true,
    },
    Tag : {
        Type: String,
        required: true,
    }
},{ versionKey: false });

const Activitytag = mongoose.model('activity_tags', activity_tagsSchema);
module.exports = Activitytag;