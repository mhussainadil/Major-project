let express = require("express");
let app = express();
let path = require("path");
let methodOverride = require("method-override");
let ejsmate=require("ejs-mate");
app.engine("ejs",ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.listen(8080, () => {
    console.log(`server is live on: ${`http://localhost:8080/listings`}`);
})
const mongoose = require('mongoose');
const Listing = require("./models/listing");

main().then(() => {
    console.log("connected to DBASE");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');


}
app.get("/",(req,res)=>{
    try{
res.send("HOME ROUTE")
    }catch(e){
        res.send(e);
    }
})
app.get("/listings", async (req, res) => {
    let data = await Listing.find({});
    res.render("listings/index.ejs", { data });
})
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})
app.get("/listings/:id", async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ID");
    }
    const data = await Listing.findById(id);
    // console.log(data._id);
    res.render("listings/show.ejs", { info: data })
})


app.post("/listings", async (req, res) => {
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
    const newlisting = req.body.listings;
    console.log(newlisting);

    Listing.insertOne(newlisting).then(res => {
        console.log(res)
    }).catch(e => {
        console.log(e);
    })
    res.redirect("/listings")

})

app.get('/listings/:id/edit', async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        let listItem = await Listing.findOne({ _id: id });
        res.render("./listings/edit.ejs", { listItem });
    } catch (e) {
        console.log(e)
    }
})
app.put("/listings/:id", async (req, res) => {
    try {
        let id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }
        console.log(req.body)
        Listing.updateOne({ _id: id }, { ...req.body }, { runValidators: true, new: true }).then(res => {
            console.log(res);
        })
        res.redirect(`/listings`);
    }
    catch (e) {
        res.send(e.errors.message);
    }
})