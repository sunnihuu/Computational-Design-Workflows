// Bauhaus Interactive Shapes - Main JavaScript

// Performance optimization: Use requestAnimationFrame for smooth animations
let animationId;
let audioContext;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Web Audio API with error handling
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
        console.warn('Web Audio API not supported:', error);
    }
    
    // Bauhaus color palette
    const bauhausColors = [
        '#be1e2d', // red
        '#ffde17', // yellow
        '#21409a', // blue
        '#000000', // black
        '#ffffff'  // white
    ];
    
    // Sound frequencies for different shapes
    const shapeFrequencies = {
        circle: 440,    // A4
        square: 523.25, // C5
        triangle: 659.25, // E5
        line: 783.99    // G5
    };
    
    // Get all shape elements with performance optimization
    const shapes = document.querySelectorAll('.circle, .square, .triangle, .line');
    
    // Add click event listeners to each shape with throttling
    shapes.forEach(shape => {
        let lastClickTime = 0;
        const clickThrottle = 100; // ms
        
        shape.addEventListener('click', function(e) {
            const now = Date.now();
            if (now - lastClickTime < clickThrottle) return;
            lastClickTime = now;
            
            // Use requestAnimationFrame for smooth animations
            requestAnimationFrame(() => {
                // Change color randomly
                changeColorRandomly(this);
                
                // Play sound
                playShapeSound(this);
                
                // Add click animation
                addClickAnimation(this);
            });
        });
    });
    
    // Function to change color randomly with performance optimization
    function changeColorRandomly(shape) {
        const currentColor = getComputedStyle(shape).backgroundColor;
        let newColor;
        let attempts = 0;
        const maxAttempts = 10;
        
        // Get a different color than the current one with safety limit
        do {
            newColor = bauhausColors[Math.floor(Math.random() * bauhausColors.length)];
            attempts++;
        } while (newColor === currentColor && attempts < maxAttempts);
        
        // Apply the new color based on shape type
        if (shape.classList.contains('circle') || shape.classList.contains('square') || shape.classList.contains('line')) {
            shape.style.background = newColor;
        } else if (shape.classList.contains('triangle')) {
            shape.style.borderBottomColor = newColor;
        }
    }
    
    // Function to play sound for each shape with error handling
    function playShapeSound(shape) {
        if (!audioContext) return;
        
        try {
            // Resume audio context if suspended
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Determine frequency based on shape type
            let frequency;
            if (shape.classList.contains('circle')) {
                frequency = shapeFrequencies.circle;
            } else if (shape.classList.contains('square')) {
                frequency = shapeFrequencies.square;
            } else if (shape.classList.contains('triangle')) {
                frequency = shapeFrequencies.triangle;
            } else if (shape.classList.contains('line')) {
                frequency = shapeFrequencies.line;
            }
            
            // Create oscillator with performance optimization
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configure oscillator
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            
            // Configure gain (volume envelope) with smoother curve
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
            
            // Start and stop the sound
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.25);
            
        } catch (error) {
            console.warn('Audio playback error:', error);
        }
    }
    
    // Function to add click animation with performance optimization
    function addClickAnimation(shape) {
        // Remove existing animation class
        shape.classList.remove('clicked');
        
        // Force reflow for smooth animation
        shape.offsetHeight;
        
        // Add animation class
        shape.classList.add('clicked');
        
        // Remove the class after animation completes
        setTimeout(() => {
            shape.classList.remove('clicked');
        }, 100);
    }
    
    // Performance optimization: Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        if (audioContext) {
            audioContext.close();
        }
    });
    
    // Initialize the interactive playground
    console.log('Bauhaus Interactive Shapes initialized with performance optimizations');
    console.log('Click on shapes to change colors and hear sounds!');
    console.log('Shapes: Circle, Square, Triangle, Line');
});

// New York Clock and Temperature functionality

// Function to update New York time
function updateNYClock() {
    const now = new Date();
    const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    const hours = nyTime.getHours().toString().padStart(2, '0');
    const minutes = nyTime.getMinutes().toString().padStart(2, '0');
    const seconds = nyTime.getSeconds().toString().padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('ny-clock').textContent = timeString;
}

// Function to get Manhattan weather using zip code
async function updateNYTemperature() {
    try {
        const API_KEY = '5dfd6e6199a1141e47733773dafc4ac5';
        const zip = '10025'; // Upper West Side, Manhattan, New York zip code
        const API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&APPID=${API_KEY}&units=imperial`;
        
        const response = await fetch(API_ENDPOINT);
        
        if (response.ok) {
            const data = await response.json();
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            document.getElementById('ny-temperature').textContent = `${temp}°F NYC`;
        } else {
            document.getElementById('ny-temperature').textContent = 'NYC Weather';
        }
    } catch (error) {
        // Fallback if API fails
        document.getElementById('ny-temperature').textContent = 'NYC Weather';
        console.error('Weather API error:', error);
    }
}

// Initialize clock and temperature
document.addEventListener('DOMContentLoaded', () => {
    // Update clock immediately and then every second
    updateNYClock();
    setInterval(updateNYClock, 1000);
    
    // Update temperature immediately and then every 5 minutes
    updateNYTemperature();
    setInterval(updateNYTemperature, 5 * 60 * 1000);
}); 