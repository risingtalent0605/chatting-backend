const express = require('express');
const { registerUser, loginUser, getUserProfile, verifyEmail, googleLogin, getUserList } = require('../controllers/authController');
const authToken = require('../middleware/authToken');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);
router.get('/verify-email', verifyEmail);
router.post('/google-login', googleLogin);
router.get('/getUserList', authToken, getUserList);

module.exports = router;