let passportLocalMongoose=require("passport-local-mongoose");
let mongoose=require("mongoose");
// const { required } = require("joi");
let schema=mongoose.Schema;
const userSchema=new schema({
    email:{
        type:String,
        required:true
    }
    //other fields like username,password are auto initialzed by the passport-local-mongoose 
})
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);
module.exports=User
