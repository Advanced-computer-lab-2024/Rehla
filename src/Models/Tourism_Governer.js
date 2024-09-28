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
}, { timestamps: true });

const Tourism_governer = mongoose.model('Tourism_governer', Tourism_governerSchema);
module.exports = Tourism_governer;