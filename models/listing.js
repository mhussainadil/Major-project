const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review=require("./review");
let listingSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: { type: String },
    image: {
        type: String,
        //if image is not sent by user (at frontend)
        default: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsfGVufDB8fDB8fHww",
        set:
            //if image link doesnot consist an image file 
            (imgLink) => imgLink === "" ?
                "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdGVsfGVufDB8fDB8fHww" : imgLink

    },
    price: {
        type: Number,
        required: true

    },
    location: {
        type: String,
        required: true

    },
    country: {
        type: String,
        required: true

    },
    review:[
        {type: schema.Types.ObjectId,
        ref:"Review"}
    ]
    ,
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"

    }
})

//mongoose middleware for deleting the reviews , related to the deleted post/listings
// note: this middleware must be written just before model creation as in this file 
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
let allreviewsDeleted=await Review.deleteMany({_id:{$in:listing.review}});
console.log(allreviewsDeleted +" Listing Related Reviews deleted`")
    }
})
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;