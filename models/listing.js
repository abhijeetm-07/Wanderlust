const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js")


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String,
  },
  price: Number,
  location: String,
  country: String,
  review:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete",async()=>{
  if(Listing){
    await Review.deleteMany({_id:{$in:listingSchema.review}})
  }
  
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
