var mongoose = require('mongoose');

var ReplySchema = new mongoose.Schema({
   content: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   },
   tag: [String],
   vote: Number,
   replies: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Reply'
      }
   ],
   created: {
      type: Date,
      default: Date.now
   },
   title: String
});

var Reply = mongoose.model('Reply', ReplySchema);

module.exports = Reply;
