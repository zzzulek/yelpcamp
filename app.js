var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    flash           = require("connect-flash"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local").Strategy,
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    seedDb          = require("./models/seeds");
    
var commentRoutes       = require("./routes/comments"),
    reviewRoutes         = require("./routes/reviews"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcamp";
mongoose.connect(url, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
//seedDb();
app.locals.moment = require("moment");

//passport configuration
app.use(require("express-session")({
    secret: "Rusty wins cutest cat!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("yelp started");
});