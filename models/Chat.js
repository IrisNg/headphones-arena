var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
   author: String,
   message: String,
   created: {
      type: Date,
      default: Date.now
   }
});

var Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
