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
                        // Close any open submenu
                        const openSub = burgerMenu.querySelector('.has-submenu.open');
                        if (openSub) openSub.classList.remove('open');
                        burgerMenu.classList.remove('open');
                        hamburger.classList.remove('open');
                        setTimeout(() => {
                            burgerMenu.style.display = 'none';
                        }, 350);
                    }
                });
                // Submenu toggle logic
                const spatialCanvases = burgerMenu.querySelector('.has-submenu > a');
                if (spatialCanvases) {
                    spatialCanvases.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const parentLi = spatialCanvases.parentElement;
                        console.log('Spatial Canvases clicked, parent:', parentLi);
                        
                        // Close other open submenus
                        burgerMenu.querySelectorAll('.has-submenu.open').forEach(li => {
                            if (li !== parentLi) li.classList.remove('open');
                        });
                        
                        parentLi.classList.toggle('open');
                        console.log('Submenu open state:', parentLi.classList.contains('open'));
                        
                        // Debug: check if submenu is visible
                        const submenu = parentLi.querySelector('.submenu');
                        if (submenu) {
                            console.log('Submenu found:', submenu);
                            console.log('Submenu display:', submenu.style.display);
                            console.log('Submenu opacity:', submenu.style.opacity);
                        }
                    });
                }
                // Optional: close submenu when clicking another main menu item
                burgerMenu.querySelectorAll('.menu-page').forEach(link => {
                    if (!link.closest('.has-submenu')) {
                        link.addEventListener('click', () => {
                            const openSub = burgerMenu.querySelector('.has-submenu.open');
                            if (openSub) openSub.classList.remove('open');
                        });
                    }
                });
                // Menu page click handlers
                burgerMenu.querySelectorAll('.menu-page').forEach(link => {
                    link.onclick = null;
                });
                
                // Debug 2D and 3D button clicks
                burgerMenu.querySelectorAll('.submenu-page').forEach(link => {
                    link.addEventListener('click', (e) => {
                        console.log('Submenu page clicked:', link.getAttribute('data-page'));
                        console.log('Link href:', link.getAttribute('href'));
                    });
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