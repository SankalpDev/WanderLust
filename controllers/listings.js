const Listing = require("../models/listing")
const { geocodeLocation } = require("../utils/geocode.js");

const categories = [
  { key: "beach", icon: "fa-umbrella-beach", label: "Beach" },
  { key: "mountain", icon: "fa-mountain", label: "Mountain" },
  { key: "trending", icon: "fa-fire text-danger", label: "Trending" },
  { key: "city", icon: "fa-city", label: "City" },
  { key: "cabin", icon: "fa-house-chimney", label: "Cabins" },
  { key: "desert", icon: "fa-sun", label: "Desert" },
  { key: "lake", icon: "fa-water", label: "Lake" },
  { key: "boat", icon: "fa-ship", label: "Boats" },
  { key: "camping", icon: "fa-campground", label: "Camping" },
  { key: "pool", icon: "fa-person-swimming", label: "Pool" },
  { key: "omg", icon: "fa-star text-warning", label: "OMG!" }
];

module.exports.index = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 50 } = req.query;
        let allListings;

        // Clean the search parameter
        const cleanSearch = search && search.trim() !== '' ? search.trim() : null;

        if (category === "trending") {
            // Build aggregation pipeline for trending listings
            let pipeline = [];

            // If there's a search term, add a $match stage first
            if (cleanSearch) {
                pipeline.push({
                    $match: {
                        $or: [
                            { title: { $regex: cleanSearch, $options: 'i' } },
                            { location: { $regex: cleanSearch, $options: 'i' } },
                            { country: { $regex: cleanSearch, $options: 'i' } },
                            { description: { $regex: cleanSearch, $options: 'i' } }
                        ]
                    }
                });
            }

            // Add review count safely and sort
            pipeline.push(
                {
                    $addFields: {
                        reviewCount: { $size: { $ifNull: ["$reviews", []] } }
                    }
                },
                { $sort: { reviewCount: -1 } },
                { $limit: 10 }
            );

            allListings = await Listing.aggregate(pipeline);
        } else {
            // Regular category or "all"
            let query = {};

            if (cleanSearch) {
                query.$or = [
                    { title: { $regex: cleanSearch, $options: 'i' } },
                    { location: { $regex: cleanSearch, $options: 'i' } },
                    { country: { $regex: cleanSearch, $options: 'i' } },
                    { description: { $regex: cleanSearch, $options: 'i' } }
                ];
            }

            if (category && category !== "all") {
                query.category = category;
            }

            allListings = await Listing.find(query)
                .skip((page - 1) * limit)
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
        }

        res.render("listings/index.ejs", {
            allListings,
            category: category || null,
            categories,
            search: cleanSearch || null
        });

    } catch (error) {
        console.error("Error fetching listings:", error);
        req.flash("error", "Error loading listings");
        res.redirect("/");
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showPage = async (req, res) => {
    try {
        let id = req.params.id;
        const listing = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner");
        
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }
        
        res.render("listings/show.ejs", { listing });
    } catch (error) {
        console.error('Error showing listing:', error);
        req.flash("error", "Error loading listing");
        res.redirect("/listings");
    }
};

module.exports.createListing = async (req, res) => {
    try {
        // Get coordinates from location and country
        const { location, country } = req.body.listing;
        const coordinates = await geocodeLocation(location, country);

        const newListing = new Listing(req.body.listing);

        // Add coordinates
        newListing.latitude = coordinates.latitude;
        newListing.longitude = coordinates.longitude;

        // Handle image upload
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            newListing.image = { url, filename };
        }

        // Set owner
        newListing.owner = req.user._id;

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (error) {
        console.error('Error creating listing:', error);
        req.flash("error", "Error creating listing. Please try again.");
        res.redirect("/listings/new");
    }
};

module.exports.editListing = async (req, res) => {
    try {
        let id = req.params.id;
        const listing = await Listing.findById(id);
        
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist");
            return res.redirect("/listings");
        }

        if (!listing.category) {
            listing.category = "city";
            await listing.save(); 
        }

        // Optimize image URL for editing
        let originalImageUrl = listing.image?.url || "";
        if (originalImageUrl) {
            originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
        }
        
        res.render("listings/edit", { listing, originalImageUrl });
    } catch (error) {
        console.error('Error loading edit form:', error);
        req.flash("error", "Error loading listing");
        res.redirect("/listings");
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;

        // Get coordinates if location or country changed
        const { location, country } = req.body.listing;
        const coordinates = await geocodeLocation(location, country);

        // Add coordinates to update data
        req.body.listing.latitude = coordinates.latitude;
        req.body.listing.longitude = coordinates.longitude;

        // Update listing
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        // Handle image update
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
            await listing.save();
        }

        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error('Error updating listing:', error);
        req.flash("error", "Error updating listing");
        res.redirect(`/listings/${req.params.id}/edit`);
    }
};

module.exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        
        if (!deletedListing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }
        
        req.flash("success", "Listing deleted successfully!");
        res.redirect("/listings");
    } catch (error) {
        console.error('Error deleting listing:', error);
        req.flash("error", "Error deleting listing");
        res.redirect("/listings");
    }
};
