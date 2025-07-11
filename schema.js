const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location : Joi.string().required(),
        country: Joi.string().required(),
        price : Joi.number().required().min(0),
        image: Joi.string().uri().optional().allow("",null),
        category: Joi.string().valid(
            "beach", "mountain", "trending", "city", "cabin",
            "desert", "lake", "boat", "camping", "pool", "omg"
        ).required(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        // name: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});