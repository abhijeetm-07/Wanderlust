const Listing=require("../models/listing.js")


module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm=(req, res) => {
  console.log(req.user);
  
  res.render("listings/new.ejs");
}

module.exports.showListing=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
  if(!listing){
    req.flash("error"," Listing you requested does not exist!")
    res.redirect("/listings")
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  const { listing } = req.body;
  
  // Check if an image is uploaded
  let image = req.file
    ? { url: req.file.path, filename: req.file.filename }
    : {
        url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2948&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Replace with your default image URL
        filename: "default-image",
      };

  // Create a new listing
  const newListing = new Listing({ ...listing, image });
  
  // Assign the logged-in user as the owner
  newListing.owner = req.user._id;

  await newListing.save();

  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Find the existing listing
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  // Update fields from the request body
  const updatedData = { ...req.body.listing };

  // Preserve the existing image if no new image is uploaded
  if (req.file) {
    updatedData.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  } else {
    updatedData.image = listing.image; // Retain existing image
  }

  // Apply the updates
  await Listing.findByIdAndUpdate(id, updatedData, { new: true });

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};




module.exports.deleteListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," Listing Deleted!")
  res.redirect("/listings");
}