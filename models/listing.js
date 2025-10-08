const mongoose = require("mongoose");
const schema = mongoose.Schema;

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
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;