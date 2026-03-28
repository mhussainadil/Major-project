let express = require("express");
let app = express();
let path = require("path");
let methodOverride = require("method-override");
const mongoose = require('mongoose');
let ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
//models requiring
const Listing = require("./models/listing");
const Review = require("./models/review")
const User=require("./models/user.js")
//passport.js configuration for auth & secure session's
let passport=require("passport") 
let passportLocalStrategy=require("passport-local");
let passportLocalMongoose=require("passport-local-mongoose");

// requiring cookie parser & express session 
let cookieParser = require("cookie-parser");
let expressSession = require("express-session");
let flash = require("connect-flash")
const http = require("http");
const cors = require('cors');
//configuration of session
app.use(expressSession({
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}))
//compulsary lines for passport library usage to impliment autheticated secure session mgmt
///////////////////////////////////////////////////////////
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(cookieParser())
app.use(flash());
app.use(cors());

//setting connectflash as a middleWare 
//note: this must be setup as a middleware before the express routes required ****
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    // console.log(req.user);
    next();
})

// Joi based Validation on listings,reviews
const { listingSchema, reviewSchema } = require("./schema.js");
//utility code
const expressError = require("./utils/expressError");
const asyncWrap = require("./utils/wrapAsync");

// express routes
let listingRoute = require("./routes/listingRoutes.js");
let reviewRoute = require("./routes/reviewRoutes.js");
let userRoute=require("./routes/userRoutes.js")        ////////////////////////////
//router setup for parameters passing on desired routes via  mergeParams: true
let router = express.Router({ mergeParams: true });

//routes match with the Parent path
app.use("/listings", listingRoute); 
app.use("/listings/:id/review", reviewRoute)
app.use("/user",userRoute)


app.get("/", (req, res) => {
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

//Error handling check-
app.get("/err", (req, res, next) => {
    try {
        abcd = acvd;  // will throw

    } catch (e) {
        next(e);
    }
})

// app.all("*",(req,res,next)=>{
//   next(new expressError(404,"Page Not Found !..."))
// }) 

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "internal Server Error";
    res.status(status).render(`errorPages/error`, { status, message });
})
main().then(() => {
    console.log("connected to DBASE");
}).catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.listen(8080, () => {
    console.log(`server is live on: ${`http://localhost:8080/listings`}`);
})
