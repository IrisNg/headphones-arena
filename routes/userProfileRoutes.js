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
         res.json('updated!');
      }
   });
});

module.exports = router;
