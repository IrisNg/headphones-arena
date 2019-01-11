var express = require('express'),
   router = express.Router(),
   Post = require('../models/Post'),
   Headphone = require('../models/Headphone'),
   // User = require('../models/User');
   Reply = require('../models/Reply');

// FORUM
router.get('/forum', function(req, res) {
   Post.find({}, function(err, foundPosts) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundPosts);
         res.json(foundPosts);
      }
   });
});

//create forum-post page
router.post('/posts', isLoggedIn, function(req, res) {
   //Create new post in the database
   Post.create(req.body, function(err, createdPost) {
      if (err) {
         console.log(err);
      } else {
         //Add in the current user's details
         createdPost.author.id = req.user._id;
         createdPost.author.username = req.user.username;
         //Save the updated post
         createdPost.save();
         console.log(createdPost);
         res.json(createdPost);
         //Find the headphones tagged in the post
         req.body.tag.forEach(function(entry) {
            Headphone.findOne({ brandAndModel: entry.brandAndModel }, function(err, foundHeadphone) {
               if (err) {
                  console.log(err);
               } else {
                  //Push in the tags related to the headphone
                  foundHeadphone.tags.push(...entry.tags);
                  foundHeadphone.save(function(err, updatedHeadphone) {
                     if (err) {
                        console.log(err);
                     } else {
                        console.log(updatedHeadphone);
                     }
                  });
               }
            });
         });
      }
   });
});

//create forum-reply page
router.post('/replies', isLoggedIn, function(req, res) {
   //Create new post in the database
   Post.create(req.body.replyBody, function(err, createdReply) {
      if (err) {
         console.log(err);
      } else {
         //Add in the current user's details
         createdReply.author.id = req.user._id;
         createdReply.author.username = req.user.username;
         //Save the updated post
         createdReply.save();
         console.log(createdReply);
         res.json(createdReply);
         //Find the headphones tagged in the post
         req.body.replyBody.tag.forEach(function(entry) {
            Headphone.findOne({ brandAndModel: entry.brandAndModel }, function(err, foundHeadphone) {
               if (err) {
                  console.log(err);
               } else {
                  //Push in the tags related to the headphone
                  foundHeadphone.tags.push(...entry.tags);
                  foundHeadphone.save(function(err, updatedHeadphone) {
                     if (err) {
                        console.log(err);
                     } else {
                        console.log(updatedHeadphone);
                     }
                  });
               }
            });
         });
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
      }
   });
});

//show forum-post page
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
//edit forum-post page (Need?)
router.get('/posts/:id/edit', function(req, res) {
   Post.findById(req.params.id, function(err, foundPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundPost);
      }
   });
});

//update forum-post page
router.put('/posts/:id', function(req, res) {
   //!!!xxx req.body?
   Post.findByIdAndUpdate(req.params.id, req.body, function(err, updatedPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedPost);
      }
   });
});

//delete forum-post page
router.delete('/posts/:id', function(req, res) {
   Post.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next();
   }
   res.json('Please Login');
}
module.exports = router;
