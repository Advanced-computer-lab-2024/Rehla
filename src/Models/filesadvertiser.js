const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertiser_filesSchema = new Schema({

Email: {
    type: String,
    required: true
},

Files: {
    type: String,
    //required: true
},

File2: {
    type: String,
    //required: true
}

},{ versionKey: false });

const advertiser_fileModel = mongoose.model('advertiser_files', advertiser_filesSchema);
module.exports = advertiser_fileModel;