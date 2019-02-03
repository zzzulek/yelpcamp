var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    image: String,
    birthDate: Date,
    firstName: String,
    lastName: String,
    email: String,
    about: String,
    hobbies: String,
    country: String,
    city: String,
    last_login_date: { type: Date},
    isAdmin: { type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);