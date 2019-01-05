var express = require('express'),
   router = express.Router(),
   Headphone = require('../models/Headphone'),
   //SEED. PLEASE REMOVE
   headphoneSeed = require('../seeds/headphoneSeed.js');

// ARENA
//index page
router.get('/arena', function(req, res) {
   Headphone.find({}, function(err, foundHeadphones) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundHeadphones.length);
         res.json(foundHeadphones);
      }
   });
});
//create headphone page
router.post('/headphones', function(req, res) {
   // headphoneSeed.forEach(function(headphone) {
   // Headphone.create(headphone, function(err, createdHeadphone) {
   Headphone.create(req.body, function(err, createdHeadphone) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdHeadphone);
         res.json(createdHeadphone);
      }
   });
   // });
});
//edit headphone page
router.get('/headphones/:id/edit', function(req, res) {
   Headphone.findById(req.params.id, function(err, foundHeadphone) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundHeadphone);
      }
   });
});
//update headphone page
router.put('/headphones/:id', function(req, res) {
   //!!!xxx req.body?
   Headphone.findByIdAndUpdate(req.params.id, req.body, function(err, updatedHeadphone) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedHeadphone);
      }
   });
});
//delete headphone page
router.delete('/headphones/:id', function(req, res) {
   Headphone.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

module.exports = router;
