let express = require("express");

let router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const asyncWrap = require("../utils/wrapAsync");
const Review = require("../models/review")
const User = require("../models/user.js");
const { listingSchema, reviewSchema } = require("../schema.js");
let passport = require("passport");
const { saveRedirectURL } = require("../middleware/customMiddlewares.js");


router.get("/signup", (req, res) => {
    // console.log(req);
    res.render("users/user");
})
router.post("/signup", asyncWrap(async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({
            email: email,
            username: username
        });
        let newRegistration = await User.register(newUser, password);
        // login and only then redirect/flash
        req.login(newRegistration, (err) => {
            if (err) {
                req.flash("failure", "failed to signup");
                console.error(err);
                return next(err);
            }
            req.flash("success", ` ${newRegistration.username} Welcome to WanderLust`);
            // at this point req.user is set and session persisted
            return res.redirect("/listings") ;
            
        });
    } catch (e) {
        let msg = e.message;
        req.flash("error", msg);
        res.redirect("/user/signup");
    }
}))
router.get("/login", (req, res) => {
    res.render("users/userLogin.ejs");
})

//authenitacation for login requests
router.post("/login",
    saveRedirectURL,
     passport.authenticate("local",
    {
        failureRedirect: '/user/login',
        failureFlash: true
    })
    , async (req, res) => {
        
        req.flash("success", `Welcome Back! ${req.body.username}`);
        res.redirect(res.locals.redirect || "/listings");
    })

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged Out!");
        res.redirect("/listings");

    })

})
module.exports = router