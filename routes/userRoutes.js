var express = require('express'),
   router = express.Router(),
   passport = require('passport'),
   User = require('../models/User'),
   UserProfile = require('../models/UserProfile');

// AUTHENTICATION
//Handling User Sign up
router.post('/register', function(req, res) {
   //Register the new user into the database
   User.register(new User({ username: req.body.username, adminstrator: false }), req.body.password, function(
      err,
      createdUser
   ) {
      if (err) {
         res.status(400).json('Username is already taken! Please be more creative');
      }
      console.log(createdUser);
      UserProfile.create({ username: createdUser.username, userId: createdUser._id }, function(err, createdProfile) {
         if (err) {
            res.status(400).json('Profile creation failed, you are profileless');
         } else {
            console.log(createdProfile);
         }
      });
      //If registration successful, log the user in automatically
      passport.authenticate('local')(req, res, function() {
         res.json(req.user);
      });
   });
});
//Create adminstrator account
router.post('/admin/register', function(req, res) {
   //Register the new admin into the database
   User.register(new User({ username: 'boss', adminstrator: true }), 'boss', function(err, createdUser) {
      if (err) {
         res.status(400).json('Username is already taken! Please be more creative');
      }
      console.log(createdUser);
      UserProfile.create({ username: createdUser.username, userId: createdUser._id }, function(err, createdProfile) {
         if (err) {
            res.status(400).json('Profile creation failed, you are profileless');
         } else {
            console.log(createdProfile);
         }
      });
      //If registration successful, log the user in automatically
      passport.authenticate('local')(req, res, function() {
         res.json(req.user);
      });
   });
});
//Handling User Login
router.post('/login', passport.authenticate('local'), function(req, res) {
   res.json(req.user);
});

//Handling User Logout
router.get('/logout', function(req, res) {
   req.logout();
   res.json(req.user);
});
//Check User's authentication status
router.get('/user', function(req, res) {
   res.json(req.user);
});

module.exports = router;
