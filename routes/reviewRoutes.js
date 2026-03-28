let express = require("express");

let router=express.Router({mergeParams:true});

const Listing = require("../models/listing");
const asyncWrap = require("../utils/wrapAsync");
const Review = require("../models/review")
const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedin}=require("../middleware/customMiddlewares.js")


let validateReview = (req, res, next) => {
    // console.log(req.body);
    let result = reviewSchema.validate(req.body);
    if (result.error) {
        console.log(result.error.message)
        next(result.error);

    } else {
        next()
    }
}

router.post("/", 
    isLoggedin,
    validateReview, async (req, res, next) => {
    let id = req.params.id;
    // console.log(req.body);
    const newreview = new Review(req.body.review);
    newreview.author=req.user._id;

    console.log(newreview+"\n this is latest change");
    
    const listing = await Listing.findOne({ _id: id });
    // console.log("post of reviews"+ listing)
    listing.review.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","Review Added Successfully!")
    res.redirect(`/listings/${listing._id}`);
})


module.exports=router;