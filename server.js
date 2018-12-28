//-- SETUP : REQUIRING DEPENDENCIES
var express = require('express'),
   app = express(),
   mongoose = require('mongoose'),
   bodyParser = require('body-parser'),
   url = process.env.MONGODB_URI || 'mongodb://localhost:27017/headphones_arena_app',
   port = process.env.PORT || 5000;
const path = require('path');

//-- SETUP : APP CONFIG
mongoose.connect(
   url,
   { useNewUrlParser: true }
);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(require('dotenv').config());

//-- ROUTES

// ARENA
//index page
app.get('/arena', function(req, res) {
   Headphone.find({}, function(err, foundHeadphones) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundHeadphones);
         res.json(foundHeadphones);
      }
   });
});
//create headphone page
app.post('/headphones', function(req, res) {
   //!!!xxx req.body?
   Headphone.create(req.body.headphone, function(err, createdHeadphone) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdHeadphone);
      }
   });
});
//edit headphone page
app.get('/headphones/:id/edit', function(req, res) {
   Headphone.findById(req.params.id, function(err, foundHeadphone) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundHeadphone);
      }
   });
});
//update headphone page
app.put('/headphones/:id', function(req, res) {
   //!!!xxx req.body?
   Headphone.findByIdAndUpdate(req.params.id, req.body.headphone, function(err, updatedHeadphone) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedHeadphone);
      }
   });
});
//delete headphone page
app.delete('/headphones/:id', function(req, res) {
   Headphone.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

// FORUM
app.get('/forum', function(req, res) {
   Post.find({}, function(err, foundPosts) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundPosts);
         res.json(foundPosts);
      }
   });
});

//create forum-post page
app.post('/posts', function(req, res) {
   //!!!xxx req.body?
   Post.create(req.body.post, function(err, createdPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdPost);
      }
   });
});
//edit forum-post page (Need?)
app.get('/posts/:id/edit', function(req, res) {
   Post.findById(req.params.id, function(err, foundPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundPost);
      }
   });
});
//update forum-post page
app.put('/posts/:id', function(req, res) {
   //!!!xxx req.body?
   Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedPost);
      }
   });
});
//delete forum-post page
app.delete('/posts/:id', function(req, res) {
   Post.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

// BLACKSMITH
app.get('/blacksmith', function(req, res) {
   Mod.find({}, function(err, foundMods) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundMods);
         res.json(foundMods);
      }
   });
});
//create mod page
app.post('/mods', function(req, res) {
   //!!!xxx req.body?
   Mod.create(req.body.mod, function(err, createdMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdMod);
      }
   });
});
//show mod page
app.get('/mods/:id', function(req, res) {
   Mod.findById(req.params.id, function(err, foundMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundMod);
         res.json(foundMod);
      }
   });
});
//edit mod page (Need?)
app.get('/mods/:id/edit', function(req, res) {
   Mod.findById(req.params.id, function(err, foundMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundMod);
      }
   });
});
//update mod page
app.put('/mods/:id', function(req, res) {
   //!!!xxx req.body?
   Mod.findByIdAndUpdate(req.params.id, req.body.mod, function(err, updatedMod) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedMod);
      }
   });
});
//delete mod page
app.delete('/mods/:id', function(req, res) {
   Mod.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

// MARKETPLACE
app.get('/marketplace', function(req, res) {
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
app.post('/sales', function(req, res) {
   //!!!xxx req.body?
   Sale.create(req.body.sale, function(err, createdSale) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdSale);
      }
   });
});
//show sale page
app.get('/sales/:id', function(req, res) {
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
app.get('/sales/:id/edit', function(req, res) {
   Sale.findById(req.params.id, function(err, foundSale) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundSale);
      }
   });
});
//update sale page
app.put('/sales/:id', function(req, res) {
   //!!!xxx req.body?
   Sale.findByIdAndUpdate(req.params.id, req.body.sale, function(err, updatedSale) {
      if (err) {
         console.log(err);
      } else {
         console.log(updatedSale);
      }
   });
});
//delete sale page
app.delete('/sales/:id', function(req, res) {
   Sale.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
         console.log(err);
      }
   });
});

// LIVE-CHAT
//get all chat messages
app.get('/chat', function(req, res) {
   Chat.find({}, function(err, foundChats) {
      if (err) {
         console.log(err);
      } else {
         console.log(foundChats);
         res.json(foundChats);
      }
   });
});

//create chat-message page
app.post('/chat', function(req, res) {
   //!!!xxx req.body?
   Chat.create(req.body.chat, function(err, createdChat) {
      if (err) {
         console.log(err);
      } else {
         console.log(createdChat);
      }
   });
});

// AUTHENTICATION
app.post('/register', function(req, res) {});

app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
//-- PORT CONFIG
app.listen(port, function() {
   console.log('Server started on port ' + port);
});
