var express = require('express'),
   router = express.Router(),
   Post = require('../models/Post'),
   UserProfile = require('../models/UserProfile'),
   Headphone = require('../models/Headphone'),
   middleware = require('../middleware');

// FORUM
//Get categories posts upon forum page's initial loadup
router.get('/posts', (req, res) => {
   (async () => {
      //Find a mixture of both latest posts and hottest posts (posts with highest votes)
      //for each of the 4 categories - Comparison, Recommendation, Review, General
      const comparison = await findCategoryPosts('Comparison');
      const recommendation = await findCategoryPosts('Recommendation');
      const review = await findCategoryPosts('Review');
      const general = await findCategoryPosts('General');
      var response = { comparison, recommendation, review, general };
      return response;
   })()
      .then(response => {
         //Send the object to the client-side
         res.json(response);
      })
      .catch(err => {
         res.status(400).json(err);
      });
});
function findCategoryPosts(category) {
   return new Promise((resolve, reject) => {
      Post.find({ category: category })
         //Latest post comes first
         .sort({ created: -1 })
         .limit(50)
         .exec((err, foundPosts) => {
            if (err) {
               reject('Top categorized posts are not found');
            } else {
               var results = [];
               //Take some of the latest posts
               while (results.length < 3 && foundPosts.length > 0) {
                  if (results.every(post => post.title !== foundPosts[0].title)) {
                     //Add next post to results if posts in results are not of the same thread as the next post
                     const nextPost = foundPosts.shift();
                     results.push(nextPost);
                  } else {
                     //Discard the next post if a post with the same title is already included in results
                     foundPosts.shift();
                  }
               }
               //Re-sort remaining posts by vote popularity
               foundPosts.sort((a, b) => {
                  return b.vote.count - a.vote.count;
               });

               //Take some of the most up-voted posts
               while (results.length < 7 && foundPosts.length > 0) {
                  if (results.every(post => post.title !== foundPosts[0].title)) {
                     const nextPost = foundPosts.shift();
                     results.push(nextPost);
                  } else {
                     foundPosts.shift();
                  }
               }
               resolve(results);
            }
         });
   });
}
//Search for posts when user enters search term in forum page
router.post('/posts/search', (req, res) => {
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

   //Use the regular expression to search for post titles or posts with tagged headphones that matches the search term
   //Must be main post
   Post.find({
      $and: [
         { isMainPost: true },
         { $or: [{ title: { $regex: regExp } }, { 'tag.brandAndModel': { $regex: regExp } }] }
      ]
   })
      .sort({ created: -1 })
      .limit(8)
      .exec((err, foundPosts) => {
         if (err) {
            res.status(400).json('Could not find any post related to your search term');
         } else {
            res.json(foundPosts);
         }
      });
});

//Create forum-post page
router.post('/posts', middleware.isLoggedIn, (req, res) => {
   (async () => {
      //Create new post in the database
      const createdPost = await createPost(req);
      //Push created post into the current user's profile
      const updatedProfile = await pushPostIntoUserProfile(createdPost, req);
      //If this is a reply, push this reply into its parent reply/post
      if (req.body.idToReplyTo) {
         var updatedPost = await pushReplyIntoParent(createdPost, req);
      }
      return { createdPost, updatedProfile, updatedPost: updatedPost ? updatedPost : 'not reply' };
   })()
      .then(response => {
         //Send a response to client side when done so as to trigger the next request to add in the new tags
         res.json(response.createdPost);
      })
      .catch(err => {
         res.status(400).json(err);
      });
});
//Create new post in the database
function createPost(req) {
   return new Promise((resolve, reject) => {
      Post.create(req.body.body, (err, createdPost) => {
         if (err) {
            reject('Failed to create new post, did you input something you should not have?');
         } else {
            //Add in the current user's details
            createdPost.author.id = req.user._id;
            createdPost.author.username = req.user.username;
            //Find and add current user's profile ID
            UserProfile.findOne({ userId: req.user._id }, (err, foundProfile) => {
               if (err) {
                  reject('Could not find your profile');
               } else {
                  createdPost.author.profile = foundProfile._id;
                  // createdPost.vote.count = 100;
                  //Save the updated post
                  createdPost.save();
                  resolve(createdPost);
               }
            });
         }
      });
   });
}
//Push created post into the current user's profile
function pushPostIntoUserProfile(createdPost, req) {
   return new Promise((resolve, reject) => {
      UserProfile.findOne({ userId: req.user._id }, (err, foundProfile) => {
         if (err) {
            reject('Failed to add this created post to your user profile');
         } else {
            foundProfile.posts.push(createdPost);
            foundProfile.save();
            resolve(foundProfile);
         }
      });
   });
}
//Push this reply into its parent reply/post
function pushReplyIntoParent(createdPost, req) {
   return new Promise((resolve, reject) => {
      //Find the parent post/reply of this reply
      Post.findById(req.body.idToReplyTo, (err, foundPost) => {
         if (err) {
            reject(
               'The parent of your newly created post could not be found, please report to your nearest information counter for assistance'
            );
         } else {
            //Push the created reply into the parent post/reply
            foundPost.replies.push(createdPost);
            foundPost.save();
            resolve(foundPost);
         }
      });
   });
}

//Show forum-post page
router.get('/posts/:id', (req, res) => {
   //Find the Post with the same Id as the parameter
   //Populate the object references in the replies of the post
   Post.findById(req.params.id)
      // Deep populate the replies of each reply
      .populate({
         path: 'replies author.profile',
         populate: {
            path: 'replies author.profile',
            populate: {
               path: 'replies author.profile',
               populate: { path: 'replies author.profile', populate: { path: 'author.profile' } }
            }
         }
      })
      .exec((err, foundPost) => {
         if (err) {
            res.status(400).json(
               'Could not find the post thread you are looking for. Please go back to the Forum page and look at something else instead :)'
            );
         } else {
            res.json(foundPost);
         }
      });
});

//Update forum-post page
router.put('/posts/:id', middleware.isLoggedIn, (req, res) => {
   Post.findByIdAndUpdate(req.params.id, { $set: req.body.body }, (err, updatedPost) => {
      if (err) {
         res.status(400).json('Something went wrong while trying to update your post. Are you sure your post exists?');
      } else {
         //Send a response to client side when done so as to trigger the next request to remove the previous tags
         res.json(updatedPost);
      }
   });
});

//Delete content from post
//But not delete the post entirely
router.delete('/posts/:id', middleware.checkPostOwnership, (req, res) => {
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
      (err, updatedPost) => {
         if (err) {
            res.status(400).json('Something went wrong while trying to delete your post. Too bad.');
         } else {
            //Send a response to client side when done
            res.json(updatedPost);
         }
      }
   );
});

//Find the main post of a reply
router.post('/posts/find-main', (req, res) => {
   Post.findOne({ title: req.body.title, isMainPost: true }, (err, foundPost) => {
      if (err) {
         res.status(400).json('Could not find the main thread of the post you are looking for');
      } else {
         res.json(foundPost);
      }
   });
});

//Add tags from post to the respective headphones
router.put('/posts/:id/addtags', middleware.isLoggedIn, (req, res) => {
   var count = 0;
   // Find the newly tagged headphones and add in the new tags
   req.body.body.tag.forEach(entry => {
      if (entry.tags.length > 0) {
         Headphone.findOne({ brandAndModel: entry.brandAndModel }, (err, foundHeadphone) => {
            if (err) {
               res.status(400).json(
                  'Failed to find the headphone you have tagged, please refrain from tagging obsolete headphones'
               );
            } else {
               //Push in the tags related to the headphone
               foundHeadphone.tags.push({ postId: req.params.id, tags: entry.tags });
               foundHeadphone.save();
            }
         });
      }
      if (count === req.body.body.tag.length - 1) {
         res.json('Added!');
      }
      count++;
   });
});
//Remove previous tags from edited post in the respective headphones
router.put('/posts/:id/removetags', middleware.isLoggedIn, (req, res) => {
   //Find the headphones tagged previously and remove the previous tags
   for (var i = 0; i < req.body.prevTags.length; i++) {
      //Remove the object with the previous tags that can be identified with the post's id
      Headphone.update(
         { brandAndModel: req.body.prevTags[i].brandAndModel },
         { $pull: { tags: { postId: req.params.id } } },
         (err, updatedHeadphone) => {
            if (err) {
               res.status(400).json('Could not remove records of your previous tags from this post');
            }
         }
      );
      if (i === req.body.prevTags.length - 1) {
         //Send a response to client side when done so as to trigger the next request to add in the new tags
         res.json('Removal Done!');
      }
   }
});

module.exports = router;
