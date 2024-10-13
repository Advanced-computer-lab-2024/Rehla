const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourist_guide_reviewsSchema = new Schema({
    Tourist_Email : {
        type: String,
        required: true,
    },
    TourGuide_Email : {
        type: String,
        required: true,
    },
   
    Comment : {
        type: String,
    },
    Rating : {
        type: Number ,
        
    },

},{ versionKey: false });

const tourist_guide_reviews = mongoose.model('tourist_guide_reviews', tourist_guide_reviewsSchema);
module.exports = tourist_guide_reviews;