var express = require('express'),
   router = express.Router(),
   Chat = require('../models/Chat');

// LIVE-CHAT
//get all chat messages
router.get('/chat', function(req, res) {
   Chat.find({})
      .sort({ created: -1 })
      .limit(4)
      .exec(function(err, foundMessages) {
         if (err) {
            console.log(err);
         } else {
            res.json(foundMessages);
         }
      });
});

//create chat-message page
router.post('/chat', function(req, res) {
   Chat.create(req.body, function(err, createdMessage) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdMessage);
         res.json(createdMessage);
      }
   });
});

module.exports = router;
