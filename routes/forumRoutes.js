var express = require('express'),
   router = express.Router(),
   Post = require('../models/Post');

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
router.post('/posts', function(req, res) {
   //!!!xxx req.body?
   Post.create(req.body, function(err, createdPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdPost);
      }
   });
});
//show forum-post page (Need?)
router.get('/posts/:id', function(req, res) {
   Post.findById(req.params.id, function(err, foundPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundPost);
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

module.exports = router;
