const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", " You must be logged in first.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You don't have permission to edit this listing");
            return res.redirect(`/listings/${id}`);
        }
        
        next();
    } catch (error) {
        console.error('Error in isOwner middleware:', error);
        req.flash("error", "Error checking permissions");
        res.redirect("/listings");
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect("back");
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of review.");
        return res.redirect(`/listings/${req.params.id}`);
    }

    next();
};
