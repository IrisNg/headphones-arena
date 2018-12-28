var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   },
   content: String,
   created: {
      type: Date,
      default: Date.now
   }
});

var Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
