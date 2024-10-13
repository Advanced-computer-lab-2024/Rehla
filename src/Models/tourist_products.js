const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourist_productsSchema = new Schema({
    Tourist_Email : {
        type: String,
        required: true,
    },

    
    Product_Name : {
        type: String,
        required: true,
    },

    Review : {
        type: String,
        default : "No review"
       
    },
    Rating : {
        type: Number ,
      
    },

},{ versionKey: false });

const Tourist_Products = mongoose.model('Tourist_Products', tourist_productsSchema);
module.exports = Tourist_Products;