const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tourism_governerSchema = new Schema({
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
}, { versionKey: false });

const tourism_governers = mongoose.model('Tourism_governer', Tourism_governerSchema);
module.exports = tourism_governers;