var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// ROOT - Landing Page
router.get('/', function(req, res) {
    res.render("landing");
});

// =====================
// AUTHENTICATION ROUTES
// =====================

// Show register form
router.get("/register", function(req, res) {
   res.render("register"); 
});

// Handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            return res.render("register", { "error": err.message });
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

// Logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have logged out");
    res.redirect("/campgrounds");
});

module.exports = router;