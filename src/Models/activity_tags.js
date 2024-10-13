const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activity_tagsSchema = new Schema({
    Activity: {
        type: String,
        required: true,
    },
    Tag: {
        type: String,
        required: true,
    }
},{ versionKey: false });

const Activitytag = mongoose.model('activity_tags', activity_tagsSchema);
module.exports = Activitytag;