let express = require("express");
let app = express();
let router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const asyncWrap = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const mongoose = require('mongoose');
// import middleware helpers
const { isLoggedin,isOwnerofrequestedlisting } = require("../middleware/customMiddlewares.js");
let validationOfJoi = (req, res, next) => {
    let resultOfJoi = listingSchema.validate(req.body);
    if (resultOfJoi.error) {
        next(resultOfJoi.error);
    } else {
        next();
        

    }
}

router.get("/",
    asyncWrap(async (req, res) => {
        let data = await Listing.find({});
        res.render("listings/index.ejs", { data });
    }))
router.get("/new", isLoggedin, (req, res) => {
    res.render("listings/new.ejs")
})
router.get("/:id",
     asyncWrap(
    async (req, res) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new expressError(403, "Listing Not Found");
        }
        const data = await Listing.findById(id)
        .populate({
            path:"review",
             populate:{
                path: "author"
            }
        }).populate("owner").lean();
        // console.log(data);
        res.render("listings/show.ejs", { info: data })
    }))
router.post("/",
    isLoggedin,
    validationOfJoi,
    asyncWrap(async (req, res, next) => {
        const newlisting = new Listing(req.body.listings);
        newlisting.owner = req.user._id;
        await newlisting.save();
        req.flash("success", "Listing Added Successfully!")
        res.redirect("/listings")
    }));

router.get('/:id/edit', isLoggedin , isOwnerofrequestedlisting, asyncWrap(async (req, res) => {
    let id = req.params.id;

    let listItem = await Listing.findOne({ _id: id });
    if (!listItem) {
        req.flash("error", "Listing not found!")

    }
    req.flash("success", "you can continue");
    res.locals.success = req.flash("success");
    res.render("listings/edit.ejs", { listItem });
}))

router.put("/:id([0-9a-fA-F]{24})", isLoggedin, validationOfJoi, asyncWrap(async (req, res, next) => {
    let id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        next(new expressError(400, "Bad request - invalid update request!"));
    }
    // console.log(req.body)
    Listing.updateOne({ _id: id }, { $set: req.body.listings }, { runValidators: true, new: true }).then(res => {
        console.log(res);
    })
    req.flash("success", "Listing Updated Successfully!")
    res.redirect(`/listings`);

}))
router.delete("/:id/delete",asyncWrap(
    async (req,res)=>{
            let id=req.params.id;
            console.log(id);
            const doc=await Listing.findByIdAndDelete({_id:id});
            console.log(doc)
            req.flash("success","Deleted SuccessFully!")
            res.redirect("/listings");
    }
))
module.exports = router;
