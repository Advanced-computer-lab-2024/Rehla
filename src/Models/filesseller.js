const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seller_filesSchema = new Schema({

Email: {
    type: String,
    required: true
},

Files: {
    type: String,
    //required: true
}
},{ versionKey: false });

const seller_fileModel = mongoose.model('seller_files', seller_filesSchema);
module.exports = seller_fileModel;