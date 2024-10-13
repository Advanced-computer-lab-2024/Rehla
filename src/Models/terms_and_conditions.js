const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const terms_and_conditionsSchema = new Schema({
    Email: {
        type: String,
        required: true,
    },

    
    Type: {
        type: String,
        enum : ['Tour_Guide', 'Advirtisor', 'Seller'],
        required: true,
    },
    Terms_and_Conditions: {
        type: String,

    },

    Paid: {
        type: Boolean,
        required : true,
    },

},{ versionKey: false });

const Terms_and_Conditions = mongoose.model('Terms_and_Conditions', terms_and_conditionsSchema);
module.exports = Terms_and_Conditions;