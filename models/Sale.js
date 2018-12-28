var mongoose = require('mongoose');

var SaleSchema = new mongoose.Schema({
   seller: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
      },
      username: String
   },
   model: String,
   image: [String],
   price: String,
   condition: String,
   shipping: String,
   remark: String
});

var Sale = mongoose.model('Sale', SaleSchema);

module.exports = Sale;
