const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
    },
     
    Product_Name: {      //esm el product 
        type: String,
    },
   

},{ versionKey: false });

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
module.exports = Wishlist;