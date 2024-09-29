const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activity_categoriesSchema = new Schema({
    Activity : {
        type: String,
        required: true,
    },
    Category : {
        type: String,
        required: true,
    }
},{ versionKey: false });

const Activitycategory = mongoose.model('activity_categories', activity_categoriesSchema);
module.exports = Activitycategory;