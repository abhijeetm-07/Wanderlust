const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const Mongo_Url = "mongodb://127.0.0.1:27017/Wanderlust ";

main()
  .then(() => {
    console.log("db connected successfullly");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(Mongo_Url);
};

const initDb= async()=>{
  await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj,owner:"676004107430ffa11261b284"}))
  await Listing.insertMany(initData.data);
  console.log("data was initialised ");
};

initDb();
