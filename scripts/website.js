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
        
        this.state = {
            menuOpen: false
        };
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupHamburgerMenu();
            this.startClock();
            this.startWeatherUpdates();
        });
    }
    
    setupHamburgerMenu() {
        const hamburgerButton = document.getElementById('hamburger-menu');
        if (hamburgerButton) {
            hamburgerButton.addEventListener('click', () => this.toggleMenu());
        }
    }
    
    toggleMenu() {
        this.state.menuOpen = !this.state.menuOpen;
        
        if (this.state.menuOpen) {
            this.showMenu();
        } else {
            this.hideMenu();
        }
    }
    
    showMenu() {
        // Create menu container if it doesn't exist
        let menuContainer = document.getElementById('menu-container');
        if (!menuContainer) {
            menuContainer = document.createElement('div');
            menuContainer.id = 'menu-container';
            menuContainer.className = 'menu-container';
            
            // Add content list
            const contentList = document.createElement('ul');
            contentList.className = 'menu-content-list';
            
            const menuItems = [
                '2D & 3D Spatial Composition',
                'Parametric Modeling Techniques',
                'Algorithmic Form Generation',
                'Digital Fabrication Methods',
                'Building Information Modeling',
                'Generative Design Workflows',
                'Performance-Based Design',
                'Interactive Prototyping',
                'Advanced Scripting & Automation'
            ];
            
            menuItems.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'menu-item';
                listItem.textContent = item;
                contentList.appendChild(listItem);
            });
            
            menuContainer.appendChild(contentList);
            document.body.appendChild(menuContainer);
        }
        
        // Show the menu
        menuContainer.style.display = 'flex';
        menuContainer.style.opacity = '1';
        
        // Animate hamburger button
        const hamburgerButton = document.getElementById('hamburger-menu');
        if (hamburgerButton) {
            hamburgerButton.classList.add('active');
        }
    }
    
    hideMenu() {
        const menuContainer = document.getElementById('menu-container');
        if (menuContainer) {
            menuContainer.style.opacity = '0';
            setTimeout(() => {
                menuContainer.style.display = 'none';
            }, 300);
        }
        
        // Reset hamburger button
        const hamburgerButton = document.getElementById('hamburger-menu');
        if (hamburgerButton) {
            hamburgerButton.classList.remove('active');
        }
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