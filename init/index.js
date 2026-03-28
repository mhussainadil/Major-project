const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

  async function init(){
try{
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj=>({
    ...obj, owner: "69b147e8a03c69cd95539948"
  })))
await Listing.insertMany(initData.data);
console.log("data is saved newly!")
}catch (e){
  console.log(e);
}
  }
  init();
