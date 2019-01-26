var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
   isMainPost: Boolean,
   title: String,
   category: String,
   content: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   },
   tag: [{ brandAndModel: String, tags: [String] }],
   vote: { count: { type: Number, default: 0 }, upVote: [String], downVote: [String] },
   replies: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post'
      }
   ],
   

});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
