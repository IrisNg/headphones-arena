var express = require('express'),
   router = express.Router(),
   Post = require('../models/Post'),
   Headphone = require('../models/Headphone');

// FORUM
function findCategoryPosts(category) {
   return new Promise(function(resolve, reject) {
      Post.find({ category: category })
         //Latest post comes first
         .sort({ created: -1 })
         .limit(20)
         .exec(function(err, foundPosts) {
            if (err) {
               reject(err);
            } else {
               //Take 2 of the latest posts
               var results = foundPosts.splice(0, 2);
               //Resort remaining posts by vote popularity
               foundPosts.sort(function(a, b) {
                  return b.vote.count - a.vote.count;
               });
               //Combine the latest and hottest posts into one array
               results = results.concat(foundPosts.splice(0, 3));
               // console.log(results);
               resolve(results);
            }
         });
   });
}
//Find categories posts upon forum page's initial loadup
router.get('/forum', function(req, res) {
   (async function() {
      //Find a mixture of both latest posts and hottest posts (posts with highest votes)
      //for each of the 4 categories - Comparison, Recommendation, Review, General
      const comparison = await findCategoryPosts('Comparison');
      const recommendation = await findCategoryPosts('Recommendation');
      const review = await findCategoryPosts('Review');
      const general = await findCategoryPosts('General');
      var response = { comparison, recommendation, review, general };
      return response;
   })()
      .then(function(response) {
         //Send the object to the client-side
         console.log(response);
         res.json(response);
      })
      .catch(function(err) {
         console.log(err);
      });
});
//Find search posts when user enters search term in forum page
router.post('/forum/search', function(req, res) {
   var term = req.body.term;
   //Formulating Regular Expression to search for posts (using MongoDB)
   //Post matches if it contains all of the letters from the search term
   var removeSpace = term.replace(/\s/g, '');
   var prepRegExp = removeSpace.split('').join('.*');
   //Post matches if it contains any word from the search term
   var termSplit = term.split(' ').join('|');
   //Post also matches if it contains the entire string from the search term
   prepRegExp = `(${prepRegExp}|${termSplit}|${term})`;
   //Escaping all the literal characters in the inputted search term
   prepRegExp = prepRegExp.replace(/\$/g, '\\$');
   prepRegExp = prepRegExp.replace(/\?/g, '\\?');
   prepRegExp = prepRegExp.replace(/\+/g, '\\+');
   //Churn out the regular expression and flag it to be case insensitive
   var regExp = new RegExp(prepRegExp, 'i');
   // console.log(regExp);

   //Use the regular expression to search for post titles or posts with tagged headphones that matches the search term
   //Must be main post
   Post.find({
      $and: [
         { isMainPost: true },
         { $or: [{ title: { $regex: regExp } }, { 'tag.brandAndModel': { $regex: regExp } }] }
      ]
   })
      .sort({ created: -1 })
      .limit(5)
      .exec(function(err, foundPosts) {
         if (err) {
            console.log(err);
         } else {
            // console.log(foundPosts);
            res.json(foundPosts);
         }
      });
});

//create forum-post page
router.post('/posts', isLoggedIn, function(req, res) {
   //Create new post in the database
   Post.create(req.body.body, function(err, createdPost) {
      if (err) {
         console.log(err);
      } else {
         //Add in the current user's details
         createdPost.author.id = req.user._id;
         createdPost.author.username = req.user.username;
         createdPost.vote.count = 100;
         //Save the updated post
         createdPost.save();
         console.log(createdPost);
         //Send a response to client side when done so as to trigger the next request to add in the new tags
         res.json(createdPost);
      }
   });
});

//create forum-reply page
router.post('/replies', isLoggedIn, function(req, res) {
   //Create new post in the database
   Post.create(req.body.body, function(err, createdReply) {
      if (err) {
         console.log(err);
      } else {
         //Add in the current user's details
         createdReply.author.id = req.user._id;
         createdReply.author.username = req.user.username;
         createdReply.vote.count = 100;
         //Save the updated post
         createdReply.save();
         console.log(createdReply);
         //Find the parent post of this reply
         Post.findById(req.body.idToReplyTo, function(err, foundPost) {
            if (err) {
               console.log(err);
            } else {
               //Push the created reply into the parent post
               foundPost.replies.push(createdReply);
               foundPost.save(function(err, updatedPost) {
                  if (err) {
                     console.log(err);
                  } else {
                     console.log(updatedPost);
                  }
               });
            }
         });
         //Send a response to client side when done so as to trigger the next request to add in the new tags
         res.json(createdReply);
      }
   });
});

//Show forum-post page
router.get('/posts/:id', function(req, res) {
   //Find the Post with the same Id as the parameter
   //Populate the object references in the replies of the post
   Post.findById(req.params.id)
      // Deep populate the replies of each reply
      .populate({
         path: 'replies',
         populate: { path: 'replies', populate: { path: 'replies', populate: { path: 'replies' } } }
      })
      .exec(function(err, foundPost) {
         if (err) {
            console.log(err);
         } else {
            console.log(foundPost);
            res.json(foundPost);
         }
      });
});

//update forum-post page
router.put('/posts/:id', function(req, res) {
   Post.findByIdAndUpdate(req.params.id, { $set: req.body.body }, function(err, updatedPost) {
      if (err) {
         console.log(err);
      } else {
         //Send a response to client side when done so as to trigger the next request to remove the previous tags
         console.log(updatedPost);
         res.json(updatedPost);
      }
   });
});

//Delete content from post
router.delete('/posts/:id', function(req, res) {
   console.log(req.params.id);
   Post.findByIdAndUpdate(
      req.params.id,
      {
         $set: {
            content: '~Content has been removed~',
            'author.username': '-',
            tag: [],
            vote: { count: 0, upVote: [], downVote: [] }
         }
      },
      function(err, updatedPost) {
         if (err) {
            console.log(err);
         } else {
            //Send a response to client side when done
            console.log(updatedPost);
            res.json(updatedPost);
         }
      }
   );
});

//Find the main post of a reply
router.post('/posts/find-main', function(req, res) {
   Post.findOne({ title: req.body.title, isMainPost: true }, function(err, foundPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundPost);
         res.json(foundPost);
      }
   });
});

//Add tags from post to the respective headphones
router.put('/posts/:id/addtags', function(req, res) {
   var count = 0;
   // Find the newly tagged headphones and add in the new tags
   req.body.body.tag.forEach(function(entry) {
      Headphone.findOne({ brandAndModel: entry.brandAndModel }, function(err, foundHeadphone) {
         if (err) {
            console.log(err);
         } else {
            if (entry.tags.length > 0) {
               //Push in the tags related to the headphone
               foundHeadphone.tags.push({ postId: req.params.id, tags: entry.tags });
               foundHeadphone.save(function(err, updatedHeadphone) {
                  if (err) {
                     console.log(err);
                  } else {
                     console.log(updatedHeadphone);
                  }
               });
            }
         }
      });
      if (count === req.body.body.tag.length - 1) {
         res.json('Added!');
      }
      count++;
   });
});
//Remove previous tags from edited post in the respective headphones
router.put('/posts/:id/removetags', function(req, res) {
   //Find the headphones tagged previously and remove the previous tags
   for (var i = 0; i < req.body.prevTags.length; i++) {
      //Remove the object with the previous tags that can be identified with the post's id
      Headphone.update(
         { brandAndModel: req.body.prevTags[i].brandAndModel },
         { $pull: { tags: { postId: req.params.id } } },
         function(err, updatedHeadphone) {
            if (err) {
               console.log(err);
            } else {
               console.log(updatedHeadphone);
            }
         }
      );
      if (i === req.body.prevTags.length - 1) {
         //Send a response to client side when done so as to trigger the next request to add in the new tags
         res.json('Removal Done!');
      }
   }
});

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.json('Please Login');
}
module.exports = router;
