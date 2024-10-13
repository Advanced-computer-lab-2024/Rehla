const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourist_complaintsSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
    },

    
    Status: {
        type: String,
        enum :['pending', 'resolved'],
        default: 'pending',
    },
    Title: {
        type: String,
        required: true,
    },

    Body: {
        type: String,
        required : true,
    },
    Date_Of_Complaint: {
        type: Date ,
        default: Date.now,
    },
    Reply:{
        type : String,
        default: null,
    },

},{ versionKey: false });

const Tourist_Complaints = mongoose.model('Tourist_Complaints', tourist_complaintsSchema);
module.exports = Tourist_Complaints;