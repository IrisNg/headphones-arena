var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
   title: String,
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
   }
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
