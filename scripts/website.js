// Computational Design Workflows - Main Website (Clock & Weather)
class CDWWebsite {
    constructor() {
        this.config = {
            weather: {
                apiKey: '5dfd6e6199a1141e47733773dafc4ac5',
                zipCode: '10025',
                updateInterval: 5 * 60 * 1000 // 5 minutes
            }
        };
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.startClock();
            this.startWeatherUpdates();
        });
    }
    
    startClock() {
        const updateClock = () => {
            const clockElement = document.getElementById('ny-clock');
            if (!clockElement) return;
            
            try {
                const nyTime = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
                clockElement.textContent = nyTime.toLocaleTimeString('en-US', { hour12: false });
            } catch (error) {
                console.error('Clock error:', error);
            }
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    async startWeatherUpdates() {
        const updateWeather = async () => {
            const tempElement = document.getElementById('ny-temperature');
            if (!tempElement) return;
            
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?zip=${this.config.weather.zipCode}&appid=${this.config.weather.apiKey}&units=imperial`
                );
                
                if (!response.ok) throw new Error(`API error: ${response.status}`);
                
                const data = await response.json();
                tempElement.textContent = data.main?.temp 
                    ? `${Math.round(data.main.temp)}°F NYC`
                    : 'NYC Weather';
            } catch (error) {
                tempElement.textContent = 'NYC Weather';
                console.error('Weather error:', error.message);
            }
        };
        
        updateWeather();
        setInterval(updateWeather, this.config.weather.updateInterval);
    }
}

// Initialize the website
new CDWWebsite(); 