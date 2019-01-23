var express = require('express'),
   router = express.Router(),
   Headphone = require('../models/Headphone'),
   Post = require('../models/Post'),
   request = require('request'),
   iconv = require('iconv-lite'),
   //SEED. PLEASE REMOVE
   headphoneSeed = require('../seeds/headphoneSeed.js');

// ARENA
//index page
router.get('/arena', (req, res) => {
   Headphone.find({}, (err, foundHeadphones) => {
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
router.get('/headphones/:id', (req, res) => {
   Headphone.findById(req.params.id, (err, foundHeadphone) => {
      if (err) {
         console.log(err);
      } else {
         res.json(foundHeadphone);
      }
   });
});
// router.post('/arena/pricefind', function(req, res) {
//    // var url = req.body.amazonLink;
//    var url = 'https://www.amazon.com/dp/B0798TVDVJ';
//    request({ url: url, encoding: null }, function(error, response, body) {
//       if (!error && response.statusCode == 200) {
//          var encoding = 'ISO-8859-1';
//          var content = iconv.decode(body, encoding);
//          // content2 = iconv.encode(content, 'utf-8');
//          console.log(content);
//       }
//    });
//    // console.log(body);
//    // const regex = /<span id="priceblock_ourprice" .*>.*<\/span>/;
//    // var match = regex.exec(body);
//    // console.log(match);
//    // }
//    // });
// });
//Find the top posts related to the selected headphone
router.post('/forum/topposts', (req, res) => {
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
   //Post also matches if it contains the entire string from the brandAndModel or model
   if (alternative) {
      var requirements = `(${allWords}|${brandAndModel}|${allModelWords}|${alternative[1]})`;
   } else {
      var requirements = `(${allWords}|${brandAndModel}|${allModelWords})`;
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
      .exec((err, foundPosts) => {
         if (err) {
            console.log(err);
         } else {
            console.log(foundPosts);
            res.json({ headphone: req.body.brandAndModel, topPosts: foundPosts });
         }
      });
});
//create headphone page
router.post('/headphones', (req, res) => {
   headphoneSeed.forEach(headphone => {
      Headphone.create(headphone, (err, createdHeadphone) => {
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
//update headphone page
router.put('/headphones/:id', (req, res) => {
   Headphone.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, updatedHeadphone) => {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedHeadphone);
         res.json(updatedHeadphone);
      }
   });
});
//delete headphone page
router.delete('/headphones/:id', (req, res) => {
   Headphone.findByIdAndRemove(req.params.id, err => {
      if (err) {
         console.log(err);
      }
   });
});

module.exports = router;
