const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
    Product_Name: {
        type : String , 
        required : true,
        unique : true,

    },

    Picture: {
        type : String , 
        required : true,
    },

    Price:{
        type : Number ,
        required: true,
    } , 

    Quantity:{
        type : Number ,
        required: true,
    } , 

    Seller_Name: {
        type : String , 
        required : true,
    },

    Description: {
        type : String , 
        required : true,
    },

    Rating:{
        type : Number ,
    } , 

    Reviews:{
        type : Number ,
    } , 
    Archived: {
        type : Boolean,
        default : false,
    },
    Saled:{
        type: Number,
        default: 0,
    },


},{ versionKey: false });

const product = mongoose.model('Product', productsSchema);
module.exports = product;