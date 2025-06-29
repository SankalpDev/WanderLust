const mongoose = require("mongoose");
const Listing = require("./models/listing"); // Adjust path if needed

const MONGO_URI = "mongodb://localhost:27017/wanderlust"; // ✅ Your correct DB

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");

        const result = await Listing.updateMany(
            {}, // Match all documents
            { $set: { reviews: [] } } // Set reviews to empty array
        );

        console.log(`✅ Cleared reviews from ${result.modifiedCount} listings`);
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("DB Error:", err);
    });
