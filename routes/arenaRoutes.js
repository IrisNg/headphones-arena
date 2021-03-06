var express = require('express'),
   router = express.Router(),
   Headphone = require('../models/Headphone'),
   Post = require('../models/Post'),
   middleware = require('../middleware'),
   //Seed file
   headphoneSeed = require('../seeds/headphoneSeed.js');

// ARENA
//Index page
router.get('/headphones', (req, res) => {
   Headphone.find({}, (err, foundHeadphones) => {
      if (err) {
         res.status(400).json('Essential list of headphones is missing, something is wrong with the server, please try again later.');
      } else {
         var foundHeadphonesNames = foundHeadphones.map(headphone => {
            return {
               brand: headphone.brand,
               model: headphone.model,
               brandAndModel: headphone.brandAndModel,
               _id: headphone._id
            };
         });
         res.json(foundHeadphonesNames);
      }
   });
});
//Show headphone
router.get('/headphones/:id', (req, res) => {
   Headphone.findById(req.params.id, (err, foundHeadphone) => {
      if (err) {
         res.status(400).json('Could not find details for this specific headphone, please try something else?');
      } else {
         res.json(foundHeadphone);
      }
   });
});
//Find the top posts related to the selected headphone
router.post('/posts/top', (req, res) => {
   var brandAndModel = req.body.brandAndModel;
   var model = req.body.model;
   //Separate the alternative naming from the brandAndModel and model
   const alternative = /\((.*)\)/.exec(model);
   brandAndModel = brandAndModel.replace(/\s\(.*\)/g, '');
   model = model.replace(/\s\(.*\)/g, '');
   //Formulating Regular Expression to search for posts (using MongoDB)
   //Post matches if it contains all of the words from the brandAndModel, regardless of the letters/words in between
   const allWords = brandAndModel.split(' ').join('.*');
   //Post matches if it contains all of the words from the model, regardless of the whitespaces in between
   const allModelWords = model.split(' ').join('\\s*');
   //Post also matches if it contains the entire string from the brandAndModel or model
   if (alternative) {
      var requirements = `(${allWords}|${brandAndModel}|${allModelWords}|${alternative[1]})`;
   } else {
      var requirements = `(${allWords}|${brandAndModel}|${allModelWords})`;
   }
   //Churn out the regular expression and flag it to be case insensitive
   const regExp = new RegExp(requirements, 'i');

   //Use the regular expression to search for post titles/content or posts with tagged headphones that matches the search term
   Post.find({
      $or: [{ title: { $regex: regExp } }, { 'tag.brandAndModel': { $regex: regExp } }, { content: { $regex: regExp } }]
   })
      .sort({ 'vote.count': -1 })
      .limit(7)
      .exec((err, foundPosts) => {
         if (err) {
            res.status(400).json('There is no post talking about this headphone, you have bad tastes, my friend');
         } else {
            res.json({ headphone: req.body.brandAndModel, topPosts: foundPosts });
         }
      });
});
//Or seed headphone entries from file
router.post('/headphones/seed', (req, res) => {
   headphoneSeed.forEach(headphone => {
      Headphone.create(headphone, (err, createdHeadphone) => {
         if (err) {
            console.log(err);
         } else {
            console.log(createdHeadphone);
         }
      });
   });
});
//Create headphone page
router.post('/headphones', middleware.checkIfAdminstrator, (req, res) => {
   Headphone.create(req.body, function(err, createdHeadphone) {
      if (err) {
         res.status(400).json('Failed to create new headphone entry in the database');
      } else {
         res.json(createdHeadphone);
      }
   });
});

//Update headphone page
router.put('/headphones/:id', middleware.checkIfAdminstrator, (req, res) => {
   Headphone.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, updatedHeadphone) => {
      if (err) {
         res.status(400).json("Failed to update this headphone's entry in the database");
      } else {
         res.json(updatedHeadphone);
      }
   });
});
//Delete headphone page
router.delete('/headphones/:id', middleware.checkIfAdminstrator, (req, res) => {
   Headphone.findByIdAndRemove(req.params.id, err => {
      if (err) {
         res.status(400).json("Failed to remove this headphone's entry from the database");
      } else {
         res.json('headphone deleted!');
      }
   });
});

module.exports = router;
