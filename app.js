let express = require("express");
let app = express();
let path = require("path");
let methodOverride = require("method-override");
let ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
const http = require("http");
const cors = require('cors');
app.use(cors());
app.listen(8080, () => {
    console.log(`server is live on: ${`http://localhost:8080/listings`}`);
})

const mongoose = require('mongoose');
const Listing = require("./models/listing");
const asyncWrap=require("./utils/wrapAsync");
const expressError = require("./utils/expressError");
const {listingSchema}=require("./schema.js");
main().then(() => {
    console.log("connected to DBASE");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');


}

app.get("/",  (req, res) => {
    res.send("HOME ROUTE");
})



let userauth = (req, res, next) => {
    console.log(req.query)
    let { token } = req.query;

    if (token === "giveaccess") {
        return next();
    }
    let e = new expressError(403, "UnAuthorized Access!");
    res.status(e.status).render(`errorPages/error`, { status: e.status, message: e.message });

}

let validationOfJoi=(req,res,next)=>{
    let resultOfJoi=listingSchema.validate(req.body);
    if(resultOfJoi.error){
        next(resultOfJoi.error);
    }else{
        next();
    }
}
app.get("/listings",
    asyncWrap(async (req, res) => {
        let data = await Listing.find({});
        res.render("listings/index.ejs", { data });
    }))
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})
app.get("/listings/:id", asyncWrap(
    async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new expressError(403,"Listing Not Found");
    }
    const data = await Listing.findById(id);
    // console.log(data._id);
    res.render("listings/show.ejs", { info: data })
}))


//Error handling check-
app.get("/err", (req, res, next) => {
    try {
        abcd = acvd;  // will throw

    } catch (e) {
        next(e);
   }
})

app.post("/listings", validationOfJoi,
asyncWrap(    async (req, res,next) => {
    // const newlisting = new Listing(
    //     {
    //         title: req.body.title,
    //         description: req.body.description,
    //         image: req.body.image,
    //         price: req.body.price,
    //         country: req.body.country,
    //         location: req.body.location,
    //     }
    // )
    //    await newlisting.save().then((data) =>
    //     console.log(data)
    //     )
    const newlisting = req.body;
    console.log(newlisting);
    Listing.insertOne(newlisting).then(resa => {
        console.log(resa)
    }).catch(e => {
    next(e);
    })
    res.redirect("/listings")

}));


app.get('/listings/:id/edit',asyncWrap( async (req, res) => {
            let id = req.params.id;
        console.log(id);
        let listItem = await Listing.findOne({ _id: id });
        console.log(listItem)
        res.render("listings/edit.ejs", { listItem });
}))
app.put("/listings/:id([0-9a-fA-F]{24})",validationOfJoi,asyncWrap( async (req, res,next) => {
    
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          next(new expressError(400,"Bad request - invalid update request!"));
        }
        console.log(req.body)
        Listing.updateOne({ _id: id }, { $set:req.body.listings }, { runValidators: true, new: true }).then(res => {
            console.log(res);
        })
        res.redirect(`/listings`);
    
}))


app.all("*",(req,res,next)=>{
  next(new expressError(404,"Page Not Found !..."))
}) 


app.use((err, req, res, next) => {
    // console.log("--err------------------\t\t\t", err.status + err.message);
    const status = err.status || 500;
    const message = err.message || "internal Server Error";
    res.status(status).render(`errorPages/error`, { status, message });
    
})


