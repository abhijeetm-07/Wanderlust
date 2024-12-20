const express = require("express");
const router = express.Router({mergeParams:true});
const wrapasync = require("../utils/wrapasync.js");

const {validateReview, isLoggedIn, isAuthor}=require("../middleware.js");

const reviewController=require("../controllers/review.js")

//REVIEWS
//POST ROUTE
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapasync(reviewController.createReview)
);

/// DELETE Route for Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapasync(reviewController.deleteReview)
);

module.exports = router;
