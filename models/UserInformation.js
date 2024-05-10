const mongoose = require('mongoose');

const UserInformationSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    aadharNo: { type: String, required: true },
});

const UserInformation = mongoose.model('UserInformationSchema', UserInformationSchema);

module.exports = UserInformation;