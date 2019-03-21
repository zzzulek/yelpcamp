var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    image: String,
    birthDate: Date,
    email: String,
    about: String,
    hobbies: String,
    country: String,
    city: String,
    last_login_date: { type: Date},
    isAdmin: { type: Boolean, default: false}
});

var options = ({usernameField: "email"});

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", userSchema);