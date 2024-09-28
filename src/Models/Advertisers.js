const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdvertisersSchema = new Schema({
    Username: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true,
    },
    Type: {
        type: String,
        required: true
    },
    Link_to_website:{
        type:String,
    },
    Hotline:{
        type:String,
    },
    Company_Profile:{
        type:String,
    },
    Company_Name:{
        type: String,
        required: true
    }
    
}, { timestamps: true });

const Advertiser = mongoose.model('Advertisers', AdvertisersSchema);
module.exports = Advertiser;