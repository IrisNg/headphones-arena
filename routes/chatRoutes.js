var express = require('express'),
   router = express.Router(),
   Chat = require('../models/Chat');

// LIVE-CHAT
//get all chat messages
router.get('/chat', function(req, res) {
   Chat.find({}, function(err, foundChats) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundChats);
         res.json(foundChats);
      }
   });
});

//create chat-message page
router.post('/chat', function(req, res) {
   //!!!xxx req.body?
   Chat.create(req.body, function(err, createdChat) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdChat);
      }
   });
});

module.exports = router;
