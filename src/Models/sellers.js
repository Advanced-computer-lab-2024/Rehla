const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellersSchema = new Schema({ 
    Username: {
        type: String,
        required : true,
    },

    Email: {
        type : String ,
        required : true,
        unique : true,

    },

    Password:{
        type : String ,
        required : true,
    },

    Shop_Name:{
        type : String ,
        //required : true,
    },

    Description:{
        type : String ,
        //required : true,
    },

    Shop_Location:{
        type : String ,
        //required : true,
    },

    
    Type:{
        type : String ,
        required : true,
        default : "SELLER",
    },
    Logo:{
        type : String ,
        //required : true,
    },
    TermsAccepted: {
        type: Boolean,
        default: false,
        required: true
    }

}, { versionKey: false , timestamps: true });

const seller = mongoose.model('sellers' , sellersSchema);
module.exports= seller;