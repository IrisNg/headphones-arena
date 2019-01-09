//-- SETUP : REQUIRING DEPENDENCIES
var express = require('express'),
   app = express(),
   bodyParser = require('body-parser'),
   mongoose = require('mongoose'),
   passport = require('passport'),
   LocalStrategy = require('passport-local'),
   passportLocalMongoose = require('passport-local-mongoose'),
   session = require('express-session'),
   port = process.env.PORT || 5000;
url = process.env.MONGODB_URI || 'mongodb://localhost:27017/headphones_arena_app';

//-- SETUP : REQUIRING ROUTES
var arenaRoutes = require('./routes/arenaRoutes'),
   forumRoutes = require('./routes/forumRoutes'),
   blacksmithRoutes = require('./routes/blacksmithRoutes'),
   marketplaceRoutes = require('./routes/marketplaceRoutes'),
   chatRoutes = require('./routes/chatRoutes');

//-- SETUP : REQUIRING MODELS
var User = require('./models/User');

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
app.use(session({ secret: 'green tea macchiato', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use(arenaRoutes);
app.use(forumRoutes);
app.use(blacksmithRoutes);
app.use(marketplaceRoutes);
app.use(chatRoutes);

//-- ROUTES

// // AUTHENTICATION
//Handling User Sign up
app.post('/register', function(req, res) {
   //Register the new user into the database
   User.register(new User({ username: req.body.username }), req.body.password, function(err, createdUser) {
      if (err) {
         console.log(err);
      }
      //If registration successful, log the user in automatically
      passport.authenticate('local')(req, res, function() {
         res.json(req.user);
      });
   });
});
//Handling User Login
app.post('/login', passport.authenticate('local'), function(req, res) {
   res.json(req.user);
});

//Handling User Logout
app.get('/logout', function(req, res) {
   req.logout();
   res.json(req.user);
});

app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
//-- PORT CONFIG
app.listen(port, function() {
   console.log('Server started on port ' + port);
});
