var express = require('express'),
   router = express.Router(),
   UserProfile = require('../models/UserProfile'),
   Headphone = require('../models/Headphone');

// USER PROFILE
//Show a specific user's profile
router.get('/user/:id', (req, res) => {
   UserProfile.findOne({ userId: req.params.id })
      .populate('posts')
      .exec((err, foundProfile) => {
         if (err) {
            console.log(err);
         } else {
            res.json(foundProfile);
         }
      });
});
//Update user profile if a request is made to re-upload avatar picture or update user's headphone ratings
router.put('/user-profile/:id', (req, res) => {
   (async function() {
      //Update user profile
      const updatedProfile = await updateProfile(req);
      //If this is a request to update headphones rating
      if (req.body.headphones) {
         //Remove previous ratings made by this user in the headphones database
         var removedRatings = await removePreviousRatingsFromHeadphones(req);
         console.log(removedRatings);
         if (req.body.headphones.length > 0) {
            //Add new ratings made by this user to the headphones database
            var addedRatings = await addNewRatingsToHeadphones(req);
            console.log(addedRatings);
         }
      }
      return updatedProfile;
   })()
      //Send a response containing the updated profile back
      .then(response => res.json(response))
      .catch(err => console.log(err));
});
//Update user profile if a request is made to re-upload avatar picture or update user's headphone ratings
function updateProfile(req) {
   return new Promise((resolve, reject) => {
      UserProfile.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, updatedProfile) => {
         err ? reject(err) : resolve(updatedProfile);
      });
   });
}
//Remove all rating entries made by this user in all headphone documents
function removePreviousRatingsFromHeadphones(req) {
   return new Promise((resolve, reject) => {
      Headphone.update(
         {},
         { $pull: { ratings: { profileId: req.params.id } } },
         { multi: true },
         (err, updatedHeadphone) => {
            err ? reject(err) : resolve(updatedHeadphone);
         }
      );
   });
}
//Add new rating entries from this user into the related headphone documents
function addNewRatingsToHeadphones(req) {
   return new Promise((resolve, reject) => {
      var count = 0;
      //For each entry, find and push rating into the headphone
      req.body.headphones.forEach(entry => {
         Headphone.findOne({ brandAndModel: entry.brandAndModel }, (err, foundHeadphone) => {
            if (err) {
               reject(err);
            } else {
               foundHeadphone.ratings.push({ profileId: req.params.id, rating: entry.rating });
               foundHeadphone.save(err => {
                  if (err) {
                     reject(err);
                  }
               });
            }
         });
         //Give a heads up only after the forEach loop runs finish
         if (count === req.body.headphones.length - 1) {
            resolve('added!');
         }
         count++;
      });
   });
}
//Post a private message to a specific user's profile
router.post('/user-profile/message', (req, res) => {
   UserProfile.findOne({ userId: req.body.toUserId }, (err, foundProfile) => {
      if (err) {
         console.log(err);
      } else {
         foundProfile.privateMessages.push(req.body.body);
         foundProfile.save(err => {
            if (err) {
               console.log(err);
            } else {
               res.json('Private message sent!');
            }
         });
      }
   });
});

module.exports = router;
