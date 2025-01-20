const User = require('../models/User');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'SecretKey';
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require("dotenv").config();

const gmail_user = process.env.GMAIL_USER;
const gmail_password = process.env.GMAIL_PASS;
const frontend_url = process.env.FRONTEND_URL;
console.log(gmail_user)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmail_user,
    pass: gmail_password
  }
});

const registerUser = async (req, res) => {
  
  const { name, email, password } = req.body;

  try {

    const user = await User.findOne({ email });
    
    if (user) return res.status(400).json({ error: 'Email already exist.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1d' });
    const newUser = new User({ name, email, password: hashedPassword, verificationToken });

    newUser.save();

    const verificationUrl = `${frontend_url}verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: gmail_user,
      to: email,
      subject: 'Email Verification',
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email address.</p>`,
    };

    console.log(mailOptions)

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Registration successful. Please check your email to verify your account.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send verification email.' });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error registering user' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { email } = decoded;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

  } catch (error) {

    res.status(400).json({ message: 'Invalid or expired token.' });

  }
}

const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password!' });
    }

    if (!user.isVerified) return res.status(400).json({ error: 'Email is not verified!' })

    const token = jwt.sign({ name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

const googleLogin = async (req, res) => {

  const { email, name, accessToken } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      const newUser = new User({ email, name, accessToken })
      await newUser.save();
    }

    const token = jwt.sign({ name, email }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error loggin with Google' });
  }
}

const getUserList = async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        'email': { $ne: req.query.user }
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        _id: 0
      }
    }
  ]);
  res.json({ user });
}

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({ id: user.id, name: user.name, email: user.email });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, verifyEmail, googleLogin, getUserList };
