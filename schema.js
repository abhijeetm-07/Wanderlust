const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      filename: Joi.string().allow("", null), // Optional filename
      url: Joi.string().allow("", null), // Allow empty or null URL
    }).allow(null), // Make the image object itself optional
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review:Joi.object({
    rating:Joi.number().max(5).min(1),
    comment:Joi.string().required(),

  }).required()
})