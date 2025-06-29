// utils/geocode.js
async function geocodeLocation(location, country) {
    try {
        const address = `${location}, ${country}`;
        console.log('Geocoding address:', address);
        
        // Dynamic import for node-fetch v3
        const fetch = (await import('node-fetch')).default;
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
        console.log('Geocoding URL:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Geocoding response:', data);
        
        if (data && data.length > 0) {
            const result = {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon)
            };
            console.log('Returning coordinates:', result);
            return result;
        }
        
        console.log('No geocoding results found');
        return { latitude: null, longitude: null };
    } catch (error) {
        console.error('Geocoding error:', error);
        return { latitude: null, longitude: null };
    }
}

module.exports = { geocodeLocation };
