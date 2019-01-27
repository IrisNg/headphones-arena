//-- SETUP : REQUIRING DEPENDENCIES
var express = require('express'),
   app = express(),
   bodyParser = require('body-parser'),
   mongoose = require('mongoose'),
   passport = require('passport'),
   LocalStrategy = require('passport-local'),
   session = require('express-session'),
   port = process.env.PORT || 5000;
url = process.env.MONGODB_URI || 'mongodb://localhost:27017/headphones_arena_app';

//-- SETUP : REQUIRING ROUTES
var userRoutes = require('./routes/userRoutes'),
   chatRoutes = require('./routes/chatRoutes'),
   arenaRoutes = require('./routes/arenaRoutes'),
   forumRoutes = require('./routes/forumRoutes'),
   blacksmithRoutes = require('./routes/blacksmithRoutes'),
   marketplaceRoutes = require('./routes/marketplaceRoutes'),
   userProfileRoutes = require('./routes/userProfileRoutes');

//-- SETUP : REQUIRING MODELS
var User = require('./models/User');
var UserProfile = require('./models/UserProfile');

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

//-- ROUTES
app.use(userRoutes);
app.use(chatRoutes);
app.use(arenaRoutes);
app.use(forumRoutes);
app.use(blacksmithRoutes);
app.use(marketplaceRoutes);
app.use(userProfileRoutes);

app.get('*', function(req, res) {
   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
//-- PORT CONFIG
app.listen(port, function() {
   console.log('Server started on port ' + port);
});
