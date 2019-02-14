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
      profile: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' },
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
   created: {
      type: Date,
      default: Date.now
   }
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
