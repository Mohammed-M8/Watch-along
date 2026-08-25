const mongoose = require('mongoose')

const watchalongSchema = new mongoose.Schema({
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    invitedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    showId: {
        type: Number,
        required: true
    },
    showName: {
        type: String,
        required: true
    },
    showImage: String,
    season: {
        type: Number,
        required: true
    },
    episodes: {
        type: [Number],
        required: true
    },
    scheduledAt: {
        type: Date,
        required: true
    }
});


const Watchalong = mongoose.model('Watchalong', watchalongSchema)

module.exports = Watchalong