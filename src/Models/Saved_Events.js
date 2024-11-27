const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Saved_EventSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
    },
    TYPE: {         // activity wala itinerary
        type: String,
        required: true,
    },
    Name: {          //esm el event 
        type: String,
    },
},
{ versionKey: false });
Saved_EventSchema.index({ Tourist_Email: 1, Name: 1 }, { unique: true });

const Saved_Event = mongoose.model('Saved_EventS', Saved_EventSchema);

module.exports = Saved_Event;
