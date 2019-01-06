var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
   title: String,
   content: String,
   // relatedHeadphones: [String],
   author: {
      // id: {
      //    type: mongoose.Schema.Types.ObjectId,
      //    ref: 'User'
      // },
      username: String
   },
   tag: [{ brandAndModel: String, tags: [String] }],
   vote: { type: Number, default: 0 },
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
