const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourismgoverner_museumsandhistoricalplacesSchema = new Schema({
    Email: {
        type: String,
        required : true,
    },

    Historical_Places: {
        type: String,
        required : true,
    },

    Museums: {
        type: String,
        required : true,
    },
    
  

},{ versionKey: false });

const tourismgoverner_museumsandhistoricalplaces = mongoose.model('tourismgoverner_museumsandhistoricalplaces', tourismgoverner_museumsandhistoricalplacesSchema);
module.exports = tourismgoverner_museumsandhistoricalplaces;