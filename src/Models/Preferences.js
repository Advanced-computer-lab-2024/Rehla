// models/Preference.js
const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    match: /.+\@.+\..+/ // Validate email format
  },
  historicAreas: { type: Boolean, default: false },
  beaches: { type: Boolean, default: false },
  familyFriendly: { type: Boolean, default: false },
  shopping: { type: Boolean, default: false },
  budgetFriendly: { type: Boolean, default: false } // New field added
}, { versionKey: false }); // Disable the version key if not needed

const Preference = mongoose.model('Preference', preferenceSchema);

module.exports = Preference;
