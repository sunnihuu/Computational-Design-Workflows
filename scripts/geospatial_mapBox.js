
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
 
  map.addSource('manhattan', {
    type: 'geojson',
    data: 'manhattan.geojson'
  });
  map.addLayer({
    id: 'manhattan-fill',
    type: 'fill',
    source: 'manhattan',
    paint: {
      'fill-color': '#888',
      'fill-opacity': 0.3
    }
  });
  map.addLayer({
    id: 'manhattan-outline',
    type: 'line',
    source: 'manhattan',
    paint: {
      'line-color': '#333',
      'line-width': 2
    }
  });

  // 加载并显示曼哈顿的农贸市场点
  fetch('manhattan_farmers_markets.geojson')
    .then(response => response.json())
    .then(data => {
      if (!data.features || !Array.isArray(data.features) || data.features.length === 0) {
        console.error('GeoJSON loaded but features array is empty!');
        return;
      }
      let validCount = 0;
      data.features.forEach((feature, index) => {
        const coordinates = feature.geometry.coordinates;
        const properties = feature.properties;
        // 检查经度在[-180,180]，纬度在[-90,90]
        if (
          coordinates &&
          coordinates.length === 2 &&
          !isNaN(coordinates[0]) &&
          !isNaN(coordinates[1]) &&
          coordinates[0] >= -180 && coordinates[0] <= 180 &&
          coordinates[1] >= -90 && coordinates[1] <= 90
        ) {
          validCount++;
          new mapboxgl.Marker({ color: '#4CAF50', scale: 0.8 })
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(
              `<h3>${properties.market_name}</h3>
               <p><strong>地址:</strong> ${properties.street_address || ''}</p>
               <p><strong>营业时间:</strong> ${properties.days_of_operation || ''} ${properties.hours_of_operations || ''}</p>
               <p><strong>接受EBT:</strong> ${properties.accepts_ebt || ''}</p>
               <p><strong>全年营业:</strong> ${properties.open_year_round || ''}</p>`
            ))
            .addTo(map);
        } else {
          console.warn(`Skipping invalid coordinates for feature ${index + 1}:`, coordinates);
        }
      });
      console.log(`Successfully added ${validCount} valid farmers market markers`);
    })
    .catch(error => {
      console.error('Fetch or parse error:', error);
    });
}); 

// 显示错误信息在地图上
function showMapError(msg) {
  let mapDiv = document.getElementById('mapbox-container-3');
  if (!mapDiv) return;
  let errorDiv = document.createElement('div');
  errorDiv.style.position = 'absolute';
  errorDiv.style.top = '50%';
  errorDiv.style.left = '50%';
  errorDiv.style.transform = 'translate(-50%, -50%)';
  errorDiv.style.background = 'rgba(255, 0, 0, 0.85)';
  errorDiv.style.color = 'white';
  errorDiv.style.padding = '24px 32px';
  errorDiv.style.borderRadius = '12px';
  errorDiv.style.fontSize = '18px';
  errorDiv.style.zIndex = '9999';
  errorDiv.innerText = msg;
  mapDiv.appendChild(errorDiv);
} 