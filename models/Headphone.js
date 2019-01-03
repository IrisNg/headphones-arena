var mongoose = require('mongoose');

var HeadphoneSchema = new mongoose.Schema({
   brand: String,
   model: String,
   officialDescription: String,
   rating: Number,
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
