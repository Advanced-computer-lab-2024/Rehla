const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourguide_filesSchema = new Schema({

Email: {
    type: String,
    required: true
},

Files: {
    type: String,
    //required: true
}
},{ versionKey: false });

const tourguide_fileModel = mongoose.model('tourguide_files', tourguide_filesSchema);
module.exports = tourguide_fileModel;