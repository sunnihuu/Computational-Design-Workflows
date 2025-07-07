// Update the New York clock display
function updateNYClock() {
    const clockElement = document.getElementById('ny-clock');
    if (!clockElement) {
      console.error('Clock element not found');
      return;
    }
    try {
      const now = new Date();
      // Convert current time to New York timezone
      const nyTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      // Format time as HH:MM:SS (24-hour)
      const timeString = nyTime.toLocaleTimeString('en-US', { hour12: false });
      clockElement.textContent = timeString;
      // Uncomment for debugging:
      // console.log('Clock updated:', timeString);
    } catch (error) {
      console.error('Error updating clock:', error);
    }
  }
  
  // Fetch and update Manhattan weather by ZIP code
  async function updateNYTemperature() {
    const tempElement = document.getElementById('ny-temperature');
    if (!tempElement) {
      console.error('Temperature element not found');
      return;
    }
  
    const API_KEY = '5dfd6e6199a1141e47733773dafc4ac5';
    const zip = '10025'; // Manhattan Upper West Side ZIP code
    const API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${API_KEY}&units=imperial`;
  
    try {
      // Request weather data from OpenWeatherMap API
      const response = await fetch(API_ENDPOINT, { headers: { 'Accept': 'application/json' } });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.main?.temp != null) {
        tempElement.textContent = `${Math.round(data.main.temp)}°F NYC`;
        // Uncomment for debugging:
        // console.log('Weather updated:', tempElement.textContent);
      } else {
        tempElement.textContent = 'NYC Weather';
        console.error('Temperature data missing in response');
      }
    } catch (error) {
      tempElement.textContent = 'NYC Weather';
      console.error('Failed to fetch weather:', error.message);
    }
  }
  
  // Initialize clock and weather updates after DOM content is loaded
  document.addEventListener('DOMContentLoaded', () => {
    // testElements(); // Uncomment for debugging
  
    updateNYClock();
    setInterval(updateNYClock, 1000);
  
    updateNYTemperature();
    setInterval(updateNYTemperature, 5 * 60 * 1000);
  });
  