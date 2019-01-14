var mongoose = require('mongoose');

var HeadphoneSchema = new mongoose.Schema({
   brand: String,
   model: String,
   brandAndModel: String,
   image: String,
   tags: [{ postId: String, tags: [String] }],
   rating: { type: Number, default: 100 },
   officialDescription: String,
   specification: {
      impedance: String,
      connector: String,
      portability: String,
      color: String,
      cable: String,
      driver: String,
      sensitivity: String,
      frequencyResponse: String,
      classification: String,
      maximumPower: String,
      weight: String,
      inTheBox: String
   },
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
