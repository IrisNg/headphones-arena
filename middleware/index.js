var Post = require('../models/Post'),
   UserProfile = require('../models/UserProfile'),
   User = require('../models/User');

var middlewareObj = {};

//Check authentication
middlewareObj.isLoggedIn = function(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.status(401).json('Please login first!');
};

//Check authorization when updating or deleting post
middlewareObj.checkPostOwnership = function(req, res, next) {
   //Check authentication
   if (req.isAuthenticated()) {
      //Find author of post
      Post.findById(req.params.id, function(err, foundPost) {
         if (err) {
            res.status(404).json('Post not found');
         } else {
            //Check authorization
            if (foundPost.author.id.equals(req.user._id)) {
               next();
            } else {
               console.log('not authorized!');

               res.status(401).json('You are not authorized to do that!');
            }
         }
      });
   } else {
      res.status(401).json('Please log in before attempting this!');
   }
};
//Check authorization when updating user profile
middlewareObj.checkUserProfileOwnership = function(req, res, next) {
   //Check authentication
   if (req.isAuthenticated()) {
      //Find owner of the user profile
      UserProfile.findById(req.params.id, function(err, foundProfile) {
         if (err) {
            res.status(404).json('User profile not found');
         } else {
            //Check authorization
            if (foundProfile.userId == req.user._id) {
               next();
            } else {
               console.log('not authorized!');
               console.log(foundProfile.userId);
               console.log(req.user._id);
               res.status(401).json('You are not authorized to do that!');
            }
         }
      });
   } else {
      res.status(401).json('Please log in before attempting this!');
   }
};
//Check if user is adminstrator
middlewareObj.checkIfAdminstrator = function(req, res, next) {
   //Check authentication
   if (req.isAuthenticated()) {
      //Find user
      User.findOne({ username: req.user.username }, function(err, foundUser) {
         if (err) {
            res.status(404).json('User not found');
         } else {
            //Check if user is adminstrator
            if (foundUser.adminstrator) {
               next();
            } else {
               console.log('not authorized!');

               res.status(401).json('You are not authorized to do that!');
            }
         }
      });
   } else {
      res.status(401).json('Please log in before attempting this!');
   }
};

module.exports = middlewareObj;
