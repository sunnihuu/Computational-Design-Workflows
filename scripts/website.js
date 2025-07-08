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
            // Burger menu logic
            const hamburger = document.getElementById('hamburger-menu');
            const burgerMenu = document.getElementById('burger-menu-dropdown');
            if (hamburger && burgerMenu) {
                hamburger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const isOpen = burgerMenu.style.display === 'none' || !burgerMenu.classList.contains('open');
                    burgerMenu.style.display = 'block';
                    setTimeout(() => {
                        burgerMenu.classList.toggle('open', isOpen);
                    }, 10);
                    hamburger.classList.toggle('open', isOpen);
                });
                // Hide menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (burgerMenu.classList.contains('open') && !burgerMenu.contains(e.target) && e.target !== hamburger) {
                        burgerMenu.classList.remove('open');
                        hamburger.classList.remove('open');
                        setTimeout(() => {
                            burgerMenu.style.display = 'none';
                        }, 350);
                    }
                });
                // Menu page click handlers
                burgerMenu.querySelectorAll('.menu-page').forEach(link => {
                    link.onclick = null;
                });
            }
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