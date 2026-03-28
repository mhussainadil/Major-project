
const Listing = require("../models/listing");
module.exports.isLoggedin= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl=req.originalUrl;
        req.flash("error","You Must be logged in!");
        return res.redirect("/user/login");
    }
next();
}

module.exports.saveRedirectURL=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirect=req.session.redirecturl;
    }
    next();
}

module.exports.isOwnerofrequestedlisting=async (req,res,next)=>{
 let listing=await Listing.findById(req.params.id);
 if(!listing){
    req.flash("error","Listing not found!");
    return res.redirect("/listings");
 }
 if(req.user && req.user._id.equals(listing.owner)){
    console.log("donnnnnnnnnnneeeeeeeeeee")
    return next();
}
req.flash("error","You are not authorized for this action!");
return res.redirect(`/listings/${req.params.id}`);
}