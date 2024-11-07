const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const badgesSchema = new Schema({
    Level: {
        type : String ,
        required : true,
    },

    Picture:{
        type : String ,
        required : false,
        default : "No Picture"
    }


},{ versionKey: false });


const Badge = mongoose.model('Badge', badgesSchema);
module.exports = Badge;