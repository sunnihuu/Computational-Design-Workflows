
mapboxgl.accessToken = 'pk.eyJ1Ijoic3VubmlodSIsImEiOiJjbWQ2bDBwNzcwMThwMm9weTVjc2JuNG90In0.sVXA1xGrFWnG-1ZV_EyO1w';

const map = new mapboxgl.Map({
  container: 'mapbox-container-3',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-73.97, 40.78], 
  zoom: 11
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');
map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
map.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');

map.on('load', () => {
  fetch('../data/manhattan_farmers_markets.geojson')
    .then(response => response.json())
    .then(data => {
      if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
        return;
      }
      data.features.forEach((feature, index) => {
        const coordinates = feature.geometry.coordinates;
        const lng = Number(coordinates[0]);
        const lat = Number(coordinates[1]);
        new mapboxgl.Marker({ color: '#4CAF50', scale: 0.8 })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(
            `<h3>${feature.properties.market_name}</h3>
             <p><strong>Address:</strong> ${feature.properties.street_address || ''}</p>
             <p><strong>Hours:</strong> ${feature.properties.days_of_operation || ''} ${feature.properties.hours_of_operations || ''}</p>
             <p><strong>Accepts EBT:</strong> ${feature.properties.accepts_ebt || ''}</p>
             <p><strong>Open Year-Round:</strong> ${feature.properties.open_year_round || ''}</p>`
          ))
          .addTo(map);
      });
    })
}); 
