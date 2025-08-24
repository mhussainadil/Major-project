let express = require("express");
let app = express();
let path = require("path");
let methodOverride = require("method-override");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(8080, () => {
    console.log(`server is live on: ${`http://localhost:8080`}`);
})

const listingsCollection=require("./models/listing");

const mongoose = require('mongoose');
const Listing = require("./models/listing");

main().then(() => {
    console.log("connected to DBASE");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

   
}

app.get("/", async (req, res) => {
    let data = await Listing.find({});
    res.render("listings/index.ejs", { data });
})
app.get("/view/:id", async (req, res) => {
    const id = req.params.id;
    const data = await Listing.findById(id);
    // console.log(datafromdb);
    res.render("listings/show.ejs", { info: data })
})


app.get("/listings/new", (req, res) => [
    res.render("listings/new.ejs")
])
app.post("/listings", async (req, res) => {
    const newlisting = new Listing(
        {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            price: req.body.price,
            country: req.body.country,
            location: req.body.location,
        }
    )
   await newlisting.save().then((data) =>
    console.log(data)
    )
    res.redirect("/listings")

})

app.post("/edit/:id",(req,res)=>{
    
})