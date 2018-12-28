var mongoose = require('mongoose');

var ModSchema = new mongoose.Schema({
   master: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   },
   model: String,
   image: [String],
   video: String,
   accessories: [String],
   instruction: String,
   cost: String,
   effect: String
});

var Mod = mongoose.model('Mod', ModSchema);

module.exports = Mod;
