//-- SETUP : REQUIRING DEPENDENCIES
var express = require('express'),
   app = express(),
   bodyParser = require('body-parser'),
   mongoose = require('mongoose'),
   port = process.env.PORT || 5000;
url = process.env.MONGODB_URI || 'mongodb://localhost:27017/headphones_arena_app';

//-- SETUP : REQUIRING ROUTES
var arenaRoutes = require('./routes/arenaRoutes'),
   forumRoutes = require('./routes/forumRoutes'),
   blacksmithRoutes = require('./routes/blacksmithRoutes'),
   marketplaceRoutes = require('./routes/marketplaceRoutes'),
   chatRoutes = require('./routes/chatRoutes');

const path = require('path');

//-- SETUP : APP CONFIG
mongoose.connect(
   url,
   { useNewUrlParser: true }
);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
//NOTE: Required for axios to post form from React
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use(arenaRoutes);
app.use(forumRoutes);
app.use(blacksmithRoutes);
app.use(marketplaceRoutes);
app.use(chatRoutes);

//-- ROUTES

// // AUTHENTICATION
// app.post('/register', function(req, res) {});

// app.get('/', function(req, res) {});

app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
//-- PORT CONFIG
app.listen(port, function() {
   console.log('Server started on port ' + port);
});
