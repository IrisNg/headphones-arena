var mongoose = require('mongoose');

var UserProfileSchema = new mongoose.Schema({
   userId: String,
   username: String,
   posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
   picture: String,
   headphones: [{ brandAndModel: String, rating: { type: Number, default: 0 } }],
   privateMessages: [
      {
         subject: String,
         message: String,
         fromUsername: String,
         fromUserId: String
      }
   ],
   created: {
      type: Date,
      default: Date.now
   }
});

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;
