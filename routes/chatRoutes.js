var express = require('express'),
   router = express.Router(),
   Chat = require('../models/Chat');

// LIVE-CHAT
//Get latest chat messages
router.get('/chat', function(req, res) {
   Chat.find({})
      .sort({ created: -1 })
      .limit(12)
      .exec(function(err, foundMessages) {
         if (err) {
            res.status(400).json("Could not find recent chat messages, it's okay, just be forever alone.");
         } else {
            foundMessages.reverse();
            res.json(foundMessages);
         }
      });
});

//Create chat-message 
router.post('/chat', function(req, res) {
   Chat.create(req.body, function(err, createdMessage) {
      if (err) {
         res.status(400).json("Could not add your message to the chat. Guess you don't belong in a group after all.");
      } else {
         res.json(createdMessage);
      }
   });
});

module.exports = router;
