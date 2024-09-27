const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const touristsSchema = new Schema({
    Username : {
        type: String,
        required : true,
        immutable : true,
    },

    Email : {
        type : String ,
        required : true,
    },

    Password : {
        type : String ,
        required : true,
    },

    Mobile_Number :{
        type : String,
        required : true,
    } ,

    Nationality : {
        type : String ,
        required : true,
    },

    DOB : {
        type : Date,
        required : true,
        immutable: true
    } ,

    Job_Student : {
        type : String,
        required : true,
    } ,

    Type : {
        type : String,
        required : true,
    } ,
     
    Wallet : {
        type : Number ,
        immutable : true,
    } ,
});

const tourist = mongoose.model('Tourist', touristsSchema);
module.exports = tourist;