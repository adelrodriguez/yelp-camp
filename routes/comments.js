var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

// NEW - show form to create new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground}); 
        }
    });
});

// CREATE - create new comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    // find campground using ID
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
           req.flash("error", "Something went wrong");
           res.redirect("/campgrounds");
       } else {
           // create new comment
           Comment.create(req.body.comment, function(err, comment) {
               if (err) {
                   console.log(err);
               } else {
                   // add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   // connect new comment to campground
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   // redirect campground show page
                   req.flash("success", "Successfully added comment!")
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       } 
    });
});

// EDIT - shows form to edit comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { 
                campground_id: req.params.id,
                comment: foundComment
            });
        }
    });
});

// UPDATE - updates comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       } 
    });
});

// DESTROY - delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if (err) {
           res.redirect("/back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

module.exports = router;