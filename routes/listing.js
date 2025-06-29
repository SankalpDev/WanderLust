const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });

// Validation middleware
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    next();
};

const validateImage = (req, res, next) => {
    if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            throw new ExpressError(400, "Only JPEG, PNG, and WebP images are allowed");
        }
    }
    next();
};

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/")
    .get(wrapAsync(listingController.index))
    // .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));
    .post(
        isLoggedIn, 
        upload.single("listing[image]"), 
        validateImage,
        validateListing, 
        wrapAsync(listingController.createListing)
    );

//edit route;
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

router.route("/:id")
    .get(wrapAsync(listingController.showPage))
    .patch(
        isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"), 
        validateImage,
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
