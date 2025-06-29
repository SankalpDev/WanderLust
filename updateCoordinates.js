const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("./models/listing"); // Adjust if needed

async function getCoordinates(location) {
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        'User-Agent': 'WanderLust/1.0 (sankalp@example.com)', // Required by Nominatim
      }
    });

    if (response.data.length === 0) return null;

    const place = response.data[0];
    return {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    };
  } catch (err) {
    console.error(`Geocoding error for "${location}":`, err.message);
    return null;
  }
}

async function updateMissingCoordinates() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

  const listings = await Listing.find({
    $or: [
      { latitude: { $exists: false } },
      { longitude: { $exists: false } },
      { latitude: null },
      { longitude: null },
    ],
  });

  console.log(`🔍 Found ${listings.length} listings missing coordinates.`);

  for (let listing of listings) {
    const coords = await getCoordinates(listing.location);
    if (coords) {
      listing.latitude = coords.lat;
      listing.longitude = coords.lng;
      await listing.save();
      console.log(`✅ Updated: ${listing.title}`);
    } else {
      console.warn(`⚠️ Could not find coordinates for: ${listing.location}`);
    }
    // To avoid hitting rate limits
    await new Promise((resolve) => setTimeout(resolve, 1100)); // 1.1 sec delay
  }

  await mongoose.disconnect();
  console.log("🎉 All listings updated with coordinates.");
}

updateMissingCoordinates();
