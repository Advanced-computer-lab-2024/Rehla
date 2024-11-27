const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  Username: {
    type: String,
    required: true,

  },
  Email: {
    type: String,
    required: true,
    unique : true,

  },
  Password: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true
  }
},{ versionKey: false, timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;