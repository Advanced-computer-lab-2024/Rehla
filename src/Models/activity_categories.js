const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activity_categoriesSchema = new Schema({
    Activity : {
        Type: String,
        required: true,
    },
    Category : {
        Type: String,
        required: true,
    }
},{ versionKey: false });

const Activitycategory = mongoose.model('activity_categories', activity_categoriesSchema);
module.exports = Activitycategory;