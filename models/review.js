const { required } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const  reviewSchema=new schema({
    comment:{
    type:String,
    required:true
    },
    rating:{
        type:Number,
        min:1,
        max:5

    },
    author:{
type:schema.Types.ObjectId,
ref: "User"
    }
,
    createdAt:{
        type:Date,
        default:Date.now
    }
})
let Review=new mongoose.model("Review",reviewSchema);
module.exports=Review