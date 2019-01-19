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
         res.json(foundHeadphones);
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
   console.log(req.body.term);
   var term = req.body.term;
   //Formulating Regular Expression to search for posts (using MongoDB)
   //Post matches if it contains all of the words from the search term
   var prepRegExp = term.split(' ').join('.*');
   //Escaping all the literal characters in the inputted search term
   prepRegExp = prepRegExp.replace(/\(/g, '\\(');
   prepRegExp = prepRegExp.replace(/\)/g, '\\)');
   term = term.replace(/\(/g, '\\(');
   term = term.replace(/\)/g, '\\)');
   //Post also matches if it contains the entire string from the search term
   prepRegExp = `(${prepRegExp}|${term})`;
   //Churn out the regular expression and flag it to be case insensitive
   var regExp = new RegExp(prepRegExp, 'i');
   // console.log(regExp);

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
            res.json({ headphone: req.body.term, topPosts: foundPosts });
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
