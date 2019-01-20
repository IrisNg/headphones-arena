var express = require('express'),
   router = express.Router(),
   Headphone = require('../models/Headphone'),
   Post = require('../models/Post'),
   //SEED. PLEASE REMOVE
   headphoneSeed = require('../seeds/headphoneSeed.js');

// ARENA
//index page
router.get('/arena', function(req, res) {
   Headphone.find({}, function(err, foundHeadphones) {
      if (err) {
         console.log(err);
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
//show headphone page
router.get('/headphones/:id', function(req, res) {
   Headphone.findById(req.params.id, function(err, foundHeadphone) {
      if (err) {
         console.log(err);
      } else {
         res.json(foundHeadphone);
      }
   });
});
// router.post('/arena/pricefind', function(req, res) {
//    // var url = req.body.amazonLink;
//    var url =
//       'https://www.amazon.com/dp/B01A8NU5GM/ref=sr_1_1_twi_col_2?s=electronics&ie=UTF8&qid=1546661236&sr=1-1&keywords=cowon+plenue+d';
//    request({ encoding: null, method: 'GET', uri: url }, function(error, response, body) {
//       if (!error && response.statusCode == 200) {
//          // console.log(body);
//          // const regex = /<span id="priceblock_ourprice" .*>.*<\/span>/;
//          // var match = regex.exec(body);
//          // console.log(match);
//       }
//    });
// });
router.post('/forum/topposts', function(req, res) {
   var brandAndModel = req.body.brandAndModel;
   var model = req.body.model;
   //Separate the alternative naming from the brandAndModel and model
   var alternative = /\((.*)\)/.exec(model);
   brandAndModel = brandAndModel.replace(/\s\(.*\)/g, '');
   model = model.replace(/\s\(.*\)/g, '');
   //Formulating Regular Expression to search for posts (using MongoDB)
   //Post matches if it contains all of the words from the brandAndModel, regardless of the letters/words in between
   var allWords = brandAndModel.split(' ').join('.*');
   //Post matches if it contains all of the words from the model, regardless of the whitespaces in between
   var allModelWords = model.split(' ').join('\\s*');
   // model = model.replace(/\(/g, '\\(');
   // model = model.replace(/\)/g, '\\)');
   //Post also matches if it contains the entire string from the brandAndModel or model
   if (alternative) {
      var requirements = `(${allWords}|${brandAndModel}|${model}|${allModelWords}|${alternative[1]})`;
   } else {
      var requirements = `(${allWords}|${brandAndModel}|${model}|${allModelWords})`;
   }
   //Churn out the regular expression and flag it to be case insensitive
   var regExp = new RegExp(requirements, 'i');
   console.log(regExp);

   //Use the regular expression to search for post titles/content or posts with tagged headphones that matches the search term
   Post.find({
      $or: [{ title: { $regex: regExp } }, { 'tag.brandAndModel': { $regex: regExp } }, { content: { $regex: regExp } }]
   })
      .sort({ 'vote.count': -1 })
      .limit(5)
      .exec(function(err, foundPosts) {
         if (err) {
            console.log(err);
         } else {
            console.log(foundPosts);
            res.json({ headphone: req.body.brandAndModel, topPosts: foundPosts });
         }
      });
});
//create headphone page
router.post('/headphones', function(req, res) {
   headphoneSeed.forEach(function(headphone) {
      Headphone.create(headphone, function(err, createdHeadphone) {
         // Headphone.create(req.body, function(err, createdHeadphone) {
         if (err) {
            console.log(err);
         } else {
            console.log(createdHeadphone);
            // res.json(createdHeadphone);
         }
      });
   });
});
// //edit headphone page
// router.get('/headphones/:id/edit', function(req, res) {
//    Headphone.findById(req.params.id, function(err, foundHeadphone) {
//       if (err) {
//          console.log(err);
//       } else {
//          console.log(foundHeadphone);
//       }
//    });
// });
//update headphone page
router.put('/headphones/:id', function(req, res) {
   Headphone.findByIdAndUpdate(req.params.id, { $set: req.body }, function(err, updatedHeadphone) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedHeadphone);
         res.json(updatedHeadphone);
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
