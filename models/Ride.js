// original
// const mongoose = require('mongoose');
//
// const RideSchema = new mongoose.Schema({
//   username: String,
//   vehicleNumber: String,
//   petFriendly: Boolean,
//   smokingAllowed: Boolean,
//   availableSeats: Number,
//   source: String,
//   destination: String,
//   rating: Number,
//   startTime: Date,
//   endTime: Date,
//   contact: String,
//   email: String,
//   vehicleType: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
// }
// });

// const Ride = mongoose.model('Ride', RideSchema);

// module.exports = Ride;


//edit 1
// const mongoose = require('mongoose');

// const RideSchema = new mongoose.Schema({
//   username: String,
//   vehicleNumber: String,
//   petFriendly: Boolean,
//   smokingAllowed: Boolean,
//   availableSeats: Number,
//   source: String,
//   destination: String,
//   rating: Number,
//   startTime: Date,
//   endTime: Date,
//   contact: String,
//   email: String,
//   vehicleType: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Ride = mongoose.model('Ride', RideSchema);

// module.exports = Ride;

const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  username: String,
  vehicleNumber: String,
  petFriendly: Boolean,
  smokingAllowed: Boolean,
  availableSeats: Number,
  source: String,
  destination: String,
  rating: Number,
  startTime: Date,
  endTime: Date,
  contact: String,
  email: String,
  vehicleType: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;

