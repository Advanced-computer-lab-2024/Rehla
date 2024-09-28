const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
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
}
}, { timestamps: true });

const RequestsModel = mongoose.model('Request', RequestSchema);
module.exports = RequestsModel;