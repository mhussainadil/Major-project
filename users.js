const mongoose =require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name: {
        type: String,
    },
    addresses: [
        {
            muhalla: String,
            city: String,
            _id: false
        },
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            // _id:false
        }
    ]
})

const orderSchema = new schema({
    orderName: String,
    price: Number,
})
userSchema.post("findOneAndDelete",async (user)=>{    // ye post and pre methods of deletion ko hamesha model creation se pahle hi likhna hoga - nahi to work ni karega
let alldocs=await Order.deleteMany({_id:{$in:user.orders}})

console.log(`deleted all docs of:${user.name} -------------\n`)
console.log(alldocs)
})
const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);

// async function moveOrderstouser() {
//     // let allorders=await Order.find();
//     let user=await User.find({name:"akram hussain"}).populate("orders");
//     // console.dir(user,{depth:null});
//     console.log(JSON.stringify(user, null, 2));
// }
//  moveOrderstouser();
async function deleteDoc() {
   let user=await User.findOneAndDelete({name:"akram hussain"});
console.log("deleted first"+user);
}
deleteDoc()
main().then(() => {
    console.log("connected to DBASE");
}).catch(err => console.log(err));
async function main() {
    await mongoose.connect(`mongodb://127.0.0.1:27017/wanderlust`);
}