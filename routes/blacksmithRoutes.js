var express = require('express'),
   router = express.Router(),
   Mod = require('../models/Mod');

// BLACKSMITH
router.get('/blacksmith', function(req, res) {
   Mod.find({}, function(err, foundMods) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundMods);
         res.json(foundMods);
      }
   });
});
//create mod page
router.post('/mods', function(req, res) {
   //!!!xxx req.body?
   Mod.create(req.body, function(err, createdMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdMod);
      }
   });
});
//show mod page
router.get('/mods/:id', function(req, res) {
   Mod.findById(req.params.id, function(err, foundMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundMod);
         res.json(foundMod);
      }
   });
});
//edit mod page (Need?)
router.get('/mods/:id/edit', function(req, res) {
   Mod.findById(req.params.id, function(err, foundMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundMod);
      }
   });
});
//update mod page
router.put('/mods/:id', function(req, res) {
   //!!!xxx req.body?
   Mod.findByIdAndUpdate(req.params.id, req.body, function(err, updatedMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedMod);
      }
   });
});
//delete mod page
router.delete('/mods/:id', function(req, res) {
   Mod.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

module.exports = router;
