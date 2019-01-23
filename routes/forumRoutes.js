var express = require('express'),
   router = express.Router(),
   Post = require('../models/Post'),
   UserProfile = require('../models/UserProfile'),
   Headphone = require('../models/Headphone');

// FORUM
//Find categories posts upon forum page's initial loadup
router.get('/forum', (req, res) => {
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
         console.log(err);
      });
});
const findCategoryPosts = category => {
   return new Promise((resolve, reject) => {
      Post.find({ category: category })
         //Latest post comes first
         .sort({ created: -1 })
         .limit(20)
         .exec((err, foundPosts) => {
            if (err) {
               reject(err);
            } else {
               //Take 2 of the latest posts
               var results = foundPosts.splice(0, 2);
               //Resort remaining posts by vote popularity
               foundPosts.sort((a, b) => {
                  return b.vote.count - a.vote.count;
               });
               //Combine the latest and hottest posts into one array
               results = results.concat(foundPosts.splice(0, 3));
               // console.log(results);
               resolve(results);
            }
         });
   });
};
//Find search posts when user enters search term in forum page
router.post('/forum/search', (req, res) => {
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
      .exec((err, foundPosts) => {
         if (err) {
            console.log(err);
         } else {
            // console.log(foundPosts);
            res.json(foundPosts);
         }
      });
});

//create forum-post page
router.post('/posts', isLoggedIn, (req, res) => {
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
         console.log(response);
         //Send a response to client side when done so as to trigger the next request to add in the new tags
         res.json(response.createdPost);
      })
      .catch(err => {
         console.log(err);
      });
});
//Create new post in the database
const createPost = req => {
   return new Promise((resolve, reject) => {
      Post.create(req.body.body, (err, createdPost) => {
         if (err) {
            reject(err);
         } else {
            //Add in the current user's details
            createdPost.author.id = req.user._id;
            createdPost.author.username = req.user.username;
            createdPost.vote.count = 100;
            //Save the updated post
            createdPost.save();
            resolve(createdPost);
         }
      });
   });
};
// Push created post into the current user's profile
const pushPostIntoUserProfile = (createdPost, req) => {
   return new Promise((resolve, reject) => {
      UserProfile.findOne({ userId: req.user._id }, (err, foundProfile) => {
         if (err) {
            reject(err);
         } else {
            foundProfile.posts.push(createdPost);
            foundProfile.save();
            resolve(foundProfile);
         }
      });
   });
};
// push this reply into its parent reply/post
const pushReplyIntoParent = (createdPost, req) => {
   return new Promise((resolve, reject) => {
      //Find the parent post/reply of this reply
      Post.findById(req.body.idToReplyTo, (err, foundPost) => {
         if (err) {
            reject(err);
         } else {
            //Push the created reply into the parent post/reply
            foundPost.replies.push(createdPost);
            foundPost.save();
            resolve(foundPost);
         }
      });
   });
};

//Show forum-post page
router.get('/posts/:id', (req, res) => {
   //Find the Post with the same Id as the parameter
   //Populate the object references in the replies of the post
   Post.findById(req.params.id)
      // Deep populate the replies of each reply
      .populate({
         path: 'replies',
         populate: { path: 'replies', populate: { path: 'replies', populate: { path: 'replies' } } }
      })
      .exec((err, foundPost) => {
         if (err) {
            console.log(err);
         } else {
            console.log(foundPost);
            res.json(foundPost);
         }
      });
});

//update forum-post page
router.put('/posts/:id', (req, res) => {
   Post.findByIdAndUpdate(req.params.id, { $set: req.body.body }, (err, updatedPost) => {
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
router.delete('/posts/:id', (req, res) => {
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
      (err, updatedPost) => {
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
router.post('/posts/find-main', (req, res) => {
   Post.findOne({ title: req.body.title, isMainPost: true }, (err, foundPost) => {
      if (err) {
         console.log(err);
      } else {
         console.log(foundPost);
         res.json(foundPost);
      }
   });
});

//Add tags from post to the respective headphones
router.put('/posts/:id/addtags', (req, res) => {
   var count = 0;
   // Find the newly tagged headphones and add in the new tags
   req.body.body.tag.forEach(entry => {
      Headphone.findOne({ brandAndModel: entry.brandAndModel }, (err, foundHeadphone) => {
         if (err) {
            console.log(err);
         } else {
            if (entry.tags.length > 0) {
               //Push in the tags related to the headphone
               foundHeadphone.tags.push({ postId: req.params.id, tags: entry.tags });
               foundHeadphone.save((err, updatedHeadphone) => {
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
router.put('/posts/:id/removetags', (req, res) => {
   //Find the headphones tagged previously and remove the previous tags
   for (var i = 0; i < req.body.prevTags.length; i++) {
      //Remove the object with the previous tags that can be identified with the post's id
      Headphone.update(
         { brandAndModel: req.body.prevTags[i].brandAndModel },
         { $pull: { tags: { postId: req.params.id } } },
         (err, updatedHeadphone) => {
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
