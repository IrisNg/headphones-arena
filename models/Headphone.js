var mongoose = require('mongoose');

var HeadphoneSchema = new mongoose.Schema({
   brand: String,
   model: String,
   brandAndModel: String,
   officialDescription: String,
   rating: { type: Number, default: 100 },
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
