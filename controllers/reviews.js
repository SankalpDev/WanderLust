const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error('Error creating review:', error);
        req.flash("error", "Error adding review");
        res.redirect(`/listings/${req.params.id}`);
    }
};

module.exports.destroyReview = async (req, res) => {
    try {
        const { id, reviewId } = req.params;

        const deletedReview = await Review.findByIdAndDelete(reviewId);
        
        if (!deletedReview) {
            req.flash("error", "Review not found");
            return res.redirect(`/listings/${id}`);
        }

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        req.flash("success", "Review deleted successfully!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error('Error deleting review:', error);
        req.flash("error", "Error deleting review");
        res.redirect(`/listings/${req.params.id}`);
    }
};
