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