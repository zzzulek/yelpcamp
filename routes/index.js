var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Campground = require("../models/campground");
var passport = require("passport");
var middleware  = require("../middleware");

router.get("/", function(req, res){
    res.render("landing");
});

//auth routes
router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({email: req.body.email});
    if(req.body.email==="zulfiya.k@mail.ru"&&req.body.password==="zulya"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(error, user){
        if(error){
            req.flash("error", error.message);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.email);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local",
        {
            failureRedirect: "/login"
        }), function(req, res){
        var query = {
            'email': req.user.email
        };
        var update = {
            last_login_date: Date.now()
        };
        var options = {
            new: true
        };
        User.findOneAndUpdate(query, update, options, function(err, user) {
            if (err) {
                console.log(err);
            }
            res.redirect("/campgrounds");
        });
     req.flash("success", "Welcome to YelpCamp " + req.body.email);
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

router.get("/users/:id", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, user) {
    if(err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("/");
    }
    Campground.find().where('author.id').equals(user._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("users/show", {user: user, campgrounds: campgrounds});
    });
  });
});

router.put("/users/:id", middleware.isLoggedIn, function(req, res) {
    
    User.findByIdAndUpdate(req.params.id, req.body.user, function(error, user){
        if(error){
            req.flash("error", "Something went wrong.");
            res.redirect("/campgrounds");
        } else {
            res.redirect("/users/" + req.params.id);
        }
    });
});
module.exports = router;