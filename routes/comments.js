var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//add new cooment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, campground){
        if(error){
            res.redirect("/campgrounds/:id");
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
});

//create new comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, campground){
        if(error){
            res.redirect("/campgrounds/:id");
        } else {
            Comment.create(req.body.comment, function(error, comment){
                if(error){
                    req.flash("error", "Something went wrong");
                    console.log(error);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});
//edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    // Comment.findById(req.params.comment_id, function(error, comment){
    //     if(error){
    //         res.redirect("back");
    //     } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});
    //     }
    // });
});
//update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, text){
        if(error){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error){
        if(error){
            res.redirect("back");
        } else {
            req.flash("succes", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;