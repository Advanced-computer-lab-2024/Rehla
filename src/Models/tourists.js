const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const touristsSchema = new Schema({
    Username: {
        type: String,
        required: true,
        immutable: true, // Username cannot be changed after registration
    },
    Email: {
        type: String,
        required: true,
        unique : true,

    },
    Password: {
        type: String,
        required: true,
    },
    Mobile_Number: {
        type: String,
        required: true,
    },
    Nationality: {
        type: String,
        required: true,
    },
    DOB: {
        type: Date,
        required: true,
        immutable: true // Date of Birth is immutable
    },
    Job_Student: {
        type: String,
        required: true,
        enum: ['Job', 'Student'], // Limit to either 'Job' or 'Student'
    },
    Type: {
        type: String,
        default: 'Tourist', // Automatically set the default type to 'Tourist'
        required: true,
    },
    Wallet: {
        type: Number,
        default: 0, // Default wallet balance is 0
    },
    Points: {
        type: Number,
        default: 0, // Default wallet balance is 0
    },
    Badge: {
        
        type: String,
        enum: ['Level 1', 'Level 2', 'Level 3'],
        default : 'Level 1', 
    },
    Profile_Pic: {
        type: String
    },
    Cart_Num: {
        type: Number,
        default: 1,
    },

}, { versionKey: false , timestamps: true });

const Tourist = mongoose.model('Tourist', touristsSchema);
module.exports = Tourist;
