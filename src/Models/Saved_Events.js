const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Saved_EventSchema = new Schema({
    Tourist_Email: {
        type: String,
        required: true,
        unique: true,

    },
    TYPE: {         // activity wala itinerary
        type: String,
        required: true,
    },
   
    Name: {          //esm el event 
        type: String,
    },
   

},{ versionKey: false });

const Saved_Event = mongoose.model('Saved_EventS', Saved_EventSchema);
module.exports = Saved_Event;