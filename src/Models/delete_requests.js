const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeleteRequestSchema = new Schema({
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

const DeleteRequests = mongoose.model('Delete_requests', DeleteRequestSchema);
module.exports = DeleteRequests;