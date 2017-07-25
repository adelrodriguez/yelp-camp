var Campground = require("../models/campground"),
    Comment = require("../models/comment");

// all the middleware goes here

var middleware = {};

middleware.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
           if (err) {
               req.flash("error", "Campground not found");
               res.redirect("back");
           } else {
                // check if the user own the campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           } 
        });
    } else {
        req.flash("error", "Please login to continue");
        res.redirect("back");
    }
}

middleware.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
           if (err) {
               req.flash("error", "Comment not found");
               res.redirect("back");
           } else {
                // check if the user owns the comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
           } 
        });
    } else {
        req.flash("error", "Please login to continue");
        res.redirect("back");
    }
}

middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login to continue");
    res.redirect("/login");
}

module.exports = middleware;