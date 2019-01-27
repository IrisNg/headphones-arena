var mongoose = require('mongoose'),
   passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
   username: String,
   adminstrator: Boolean,
   password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
