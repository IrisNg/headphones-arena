var express = require('express'),
   router = express.Router(),
   Sale = require('../models/Sale');

// MARKETPLACE
router.get('/marketplace', function(req, res) {
   Sale.find({}, function(err, foundSales) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundSales);
         res.json(foundSales);
      }
   });
});

//create sale page
router.post('/sales', function(req, res) {
   //!!!xxx req.body?
   Sale.create(req.body, function(err, createdSale) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdSale);
      }
   });
});
//show sale page
router.get('/sales/:id', function(req, res) {
   Sale.findById(req.params.id, function(err, foundSale) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundSale);
         res.json(foundSale);
      }
   });
});
//edit sale page (Need?)
router.get('/sales/:id/edit', function(req, res) {
   Sale.findById(req.params.id, function(err, foundSale) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundSale);
      }
   });
});
//update sale page
router.put('/sales/:id', function(req, res) {
   //!!!xxx req.body?
   Sale.findByIdAndUpdate(req.params.id, req.body, function(err, updatedSale) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedSale);
      }
   });
});
//delete sale page
router.delete('/sales/:id', function(req, res) {
   Sale.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

module.exports = router;
