const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

/*** User Routes ***/
// Register User - GET
router.get('/register', users.renderRegisterForm);

// Register User - POST
router.post('/register', catchAsync(users.createUser));

// Login User - GET
router.get('/login', users.renderLoginForm);

// Login User - POST
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login);

// Logout User - GET
router.get('/logout', users.logout);

// Export Routes
module.exports = router;