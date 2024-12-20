const Listing = require("./models/listing.js");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be logged in to create listing");
    return res.redirect("/login")
  }
  next(); 
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner=async(req,res,next)=>{
  const { id } = req.params;
  // Check if the current user owns the listing
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of the listing.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isAuthor=async(req,res,next)=>{
  const { id,reviewId } = req.params;
  // Check if the current user owns the listing
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of the review.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error, value } = listingSchema.validate(req.body);

  if (error) {
    throw new expressError(400, error.details.map((e) => e.message).join(", "));
  }

  // Attach validated listing to req.body
  req.body.listing = value.listing;

  // Set default image if no image URL is provided
  if (!req.body.listing.image || !req.body.listing.image.url) {
    req.body.listing.image = {
      url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      filename: "default_image",
    };
  }

  next(); // Pass control to the next middleware/route handler
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new expressError(400, errMsg);
  } else {
    next();
  }
};