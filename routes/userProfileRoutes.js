var express = require('express'),
   router = express.Router(),
   UserProfile = require('../models/UserProfile');

// USER PROFILE

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

router.put('/user-profile/:id', (req, res) => {
   UserProfile.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, updatedProfile) => {
      if (err) {
         console.log(err);
      } else {
         res.json(updatedProfile);
      }
   });
});
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
