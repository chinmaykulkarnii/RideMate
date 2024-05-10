const mongoose = require('mongoose');

const BookRideSchema = new mongoose.Schema({
    username: { type: String, required: true },
    ride_id: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const BookRide = mongoose.model('BookRide', BookRideSchema);

module.exports = BookRide;