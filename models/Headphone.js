var mongoose = require('mongoose');

var HeadphoneSchema = new mongoose.Schema({
   brand: String,
   model: String,
   officialDescription: String,
   rating: Number,
   specification: String,
   image: String,
   amazonLink: String,
   topPosts: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post'
      }
   ]
});

var Headphone = mongoose.model('Headphone', HeadphoneSchema);

module.exports = Headphone;
