const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interestedEventSchema = new Schema({
    user: {
        type: String,
        ref: 'Tourist',
        required: true,
    },
    eventId: {
        type: String,
        required: true,
    },
    eventName: {
        type: String,
        //required: true,
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
});

const InterestedEvents = mongoose.model('InterestedEvents', interestedEventSchema);
module.exports = InterestedEvents;
