var mongoose = require('mongoose');

var UserProfileSchema = new mongoose.Schema({
   userId: String,
   username: String,
   posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
   picture: String,
   headphones: [{ brandAndModel: String, isLike: Boolean }]
});

var UserProfile = mongoose.model('UserProfile', UserProfileSchema);

module.exports = UserProfile;
