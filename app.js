const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Ride = require('./models/Ride');
const User = require('./models/User');
const UserInformation = require('./models/UserInformation');
const BookRide = require('./models/bookride');
const bcrypt = require('bcrypt');
const cors = require('cors');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

app.use(cors())
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// API to get a ride - original
// app.post('/get-ride',   async (req, res) => { 
//   const { from, to, date, passengers, time } = req.body;
//   const timeObject = new Date(`${date} ${time}`);

//   // Find available rides based on the provided criteria
//   const availableRides = await Ride.find({
//     source: from,
//     destination: to,
//     availableSeats: { $gte: passengers },
//     startTime: {$lte: `${date}T${time}`}
//   });

//   res.json(availableRides);
// });

//edit 1
// app.post('/get-ride', async (req, res) => { 
//   const { from, to, date, passengers, time } = req.body;
//   const currentDate = new Date();
//   const selectedDate = new Date(date);

//   // Filter out rides whose start time is in the past
//   const availableRides = await Ride.find({
//     source: new RegExp(from, 'i'),
//     destination: new RegExp(to, 'i'),
//     availableSeats: { $gte: passengers },
//     startTime: { $gte: currentDate, $lte: selectedDate }
//   });

//   res.json(availableRides);
// });



app.post('/get-ride', async (req, res) => { 
  const { from, to, date, passengers, time } = req.body;
  const selectedDateTime = new Date(`${date}T${time}`);
  const currentDateTime = new Date();

  // Ensure selected date and time are in the future
  if (selectedDateTime <= currentDateTime) {
    return res.status(400).json({ error: 'Selected date and time must be in the future' });
  }

  // Filter rides whose start time is in the future
  const availableRides = await Ride.find({
    source: { $regex: new RegExp(from, 'i') },
    destination: { $regex: new RegExp(to, 'i') },
    availableSeats: { $gte: passengers },
    startTime: { $gte: currentDateTime, $lte: selectedDateTime }
  });

  res.json(availableRides);
});





// API to offer ride
app.post('/offer-ride', async (req, res) => {
  const { username, vehicleOwnerName, vehicleModel, vehicleNumber, source, destination, startTime, endTime, vehicleType, availableSeats } = req.body;
  // sT = Date(startTime);
  // eT = Date(endTime);

  // console.log(sT,eT);
  // Fetch the user information using the username
  if (vehicleType == "bike" & availableSeats >= 2){
    return res.status(404).json({ error: 'Bike Seats more than 1' });
  }

  const userInfo = await UserInformation.findOne({ username });
  if (!userInfo) {
    return res.status(404).json({ error: 'User not found' });
  }

  const contact = userInfo.phone;
  const email = userInfo.email;

  console.log(contact,email);
  // Create a new ride document
  const newRide = new Ride({
    username,
    vehicleNumber,
    petFriendly: false,
    smokingAllowed: false,
    availableSeats,
    source,
    destination,
    rating: 5.0,
    startTime,
    endTime,
    contact,
    email,
    vehicleType,

  });

  // Save the new ride to the database
  await newRide.save();

  res.status(201).json(newRide);
});




app.post('/book-ride', async (req, res) => {
  try {
    const { username, ride_id } = req.body;

    console.log(username,ride_id);

    // Check if a booking already exists for the given username
    const existingBooking = await BookRide.findOne({ username, ride_id});
    console.log(existingBooking);
    if (existingBooking != null) {
      console.log("Booking already exists");
      return res.status(400).json({ message: 'Booking already exists for this user' });
    }

    // Create a new BookRide document
    const newBooking = new BookRide({
      username,
      ride_id
    });

    // Save the new booking to the database
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




app.get('/booking/:username/:ride_id', async (req, res) => {
  try {
    const { username, ride_id } = req.params;

    // Fetch the BookRide document
    const bookingData = await BookRide.findOne({ username, ride_id });
    if (!bookingData) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Fetch the UserInformation document
    const userInfo = await UserInformation.findOne({ username });
    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the Ride document
    const rideData = await Ride.findOne({ _id: bookingData.ride_id });
    if (!rideData) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Combine the data and send the response
    const response = {
      username: userInfo.username,
      name: userInfo.name,
      phone: userInfo.phone,
      email: userInfo.email,
      aadharNo: userInfo.aadharNo,
      vehicleNumber: rideData.vehicleNumber,
      petFriendly: rideData.petFriendly,
      smokingAllowed: rideData.smokingAllowed,
      availableSeats: rideData.availableSeats,
      source: rideData.source,
      destination: rideData.destination,
      rating: rideData.rating,
      startTime: rideData.startTime,
      endTime: rideData.endTime
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/bookings/:username', async (req, res) => {
  try {
    const username = req.params.username;

    // Query the database to find all bookings with the specified username
    const bookings = await BookRide.find({ username });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.get('/ride-info/:ride_id', async (req, res) => {
  try {
    const ride_id = req.params.ride_id;

    // Find the ride details with the given ride_id
    const ride = await Ride.findById(ride_id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    const username = ride.username;

    const info = await UserInformation.findOne({ username });
    if (!info) {
      return res.status(404).json({ message: 'User Information not found' });
    }

    res.status(200).json({ ride });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/ride-details', async (req, res) => {
  try {
    const rideIds = req.body; // Assuming rideIds is an array of ride IDs
    console.log(rideIds);
    // Find ride details for the given ride IDs
    const rides = await Ride.find({ _id: { $in: rideIds.rideIds } });
    
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});












// #################################################################### LOGIN #################################################
// Route to handle user login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Fetch the user's information
    const userInfo = await UserInformation.findOne({ username });
    if (!userInfo) {
      return res.status(404).json({ message: 'User information not found' });
    }

    // Login successful
    return res.status(200).json({
      message: 'Login successful',
      userInfo: {
        username: userInfo.username,
        name: userInfo.name,
        phone: userInfo.phone,
        email: userInfo.email,
        aadharNo: userInfo.aadharNo
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});





app.post('/signup', async (req, res) => {
  const { username, password, name, phone, email, aadharNo } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Create a new user information instance
    const newUserInformation = new UserInformation({
      username,
      name,
      phone,
      email,
      aadharNo,
    });

    // Save the new user to the database
    await newUser.save();
    await newUserInformation.save();

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Save OTP to the user's record or a separate OTP collection (for simplicity, saving it to the user record)
    newUser.otp = otp;
    await newUser.save();

    // Send OTP via email (you can also send it via SMS)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'deepakchaudhari265@gmail.com',
        pass: 'yivs fgcf yqvm lrcw',
      },
    });

    const mailOptions = {
      from: 'deepakchaudhari265@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });

    return res.status(201).json({ message: 'User created successfully, please verify OTP' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/verify-otp', async (req, res) => {
  const { username, otp } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the OTP matches
    if (user.otp === otp) {
      // OTP is correct, remove it from the user record
      user.otp = null;
      await user.save();

      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});




// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});