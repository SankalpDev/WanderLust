const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    latitude: Number,
    longitude: Number,
    category: {
        type: String,
        enum: [
            "beach", "mountain", "trending", "city", "cabin",
            "desert", "lake", "boat", "camping", "pool", "omg"
        ],
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;