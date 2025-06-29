function initializeMap(latitude, longitude, title, location, country, price) {
    try {
        // Check if coordinates are valid
        if (!latitude || !longitude) {
            console.error('Invalid coordinates provided');
            document.getElementById('map').innerHTML = '<p class="text-center text-muted">Map location not available</p>';
            return;
        }

        var map = L.map('map');

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(map);

        // Set the map view to the listing location
        map.setView([latitude, longitude], 13);

        // Add a marker for the listing
        var marker = L.marker([latitude, longitude]).addTo(map);

        // Add popup with listing information
        marker.bindPopup(`
            <div style="text-align: center; font-family: inherit;">
                <b>${title}</b><br>
                <small style="color: #666;">${location}, ${country}</small><br>
                <small style="color: #007bff; font-weight: bold;">₹${price.toLocaleString("en-IN")} per night</small>
            </div>
        `).openPopup();

        return map;
    } catch (error) {
        console.error('Error initializing map:', error);
        document.getElementById('map').innerHTML = '<p class="text-center text-danger">Error loading map</p>';
    }
}

