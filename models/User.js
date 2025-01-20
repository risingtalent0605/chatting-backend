const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  verificationToken: { type: String, default:null },
  isVerified: { type: Boolean, default: false },
  accessToken: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);
