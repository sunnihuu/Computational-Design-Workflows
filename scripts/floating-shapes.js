// Floating neon shapes for cyberminimalist site with bouncing edge behavior and diverse shapes
const SHAPE_TYPES = ['circle', 'rounded-square', 'ellipse', 'diamond', 'blob'];
const SHAPE_COUNT = 5; // Exactly 5 shapes
const MAX_SHAPES = 25; // Maximum number of shapes allowed
const MIN_SIZE = 120;
const MAX_SIZE = 350;
const MIN_SPEED = 0.3;
const MAX_SPEED = 2.0;

// Speed configuration
const BASE_SPEED = 0.5; // Base speed multiplier
const MAX_SPEED_MULTIPLIER = 3.0; // Maximum speed multiplier
const SPEED_INCREMENT = 0.1; // Speed increase per shape

// Single color for all shapes
const SHAPE_COLOR = '#00f0ff';

let allShapes = []; // Store all shapes globally
let currentSpeedMultiplier = 1.0; // Current speed multiplier
let animationId = null; // Store animation frame ID

document.addEventListener('DOMContentLoaded', () => {
    // Initialize cursor text element
    cursorText = document.getElementById('cursor-text');
    
    const container = document.getElementById('floating-shapes');
    const shapes = [];
    
    // Create exactly 5 shapes, one of each type
    for (let i = 0; i < SHAPE_TYPES.length; i++) {
        const shape = createShape(SHAPE_TYPES[i]);
        container.appendChild(shape);
        shapes.push(shape);
    }
    
    allShapes = shapes;
    animateShapes(shapes);
    
    // Add redo button functionality
    const redoButton = document.getElementById('redo-button');
    redoButton.addEventListener('click', resetToOriginal);
});


// --- CURSOR TEXT LOGIC ---
let cursorText = null;
let cursorTextVisible = false;

function showCursorText(e) {
    if (!cursorText) return;
    if (!cursorTextVisible) {
        cursorText.style.display = 'block';
        cursorText.style.opacity = '1';
        cursorTextVisible = true;
    }
    // Offset so it doesn't cover the cursor
    cursorText.style.left = (e.clientX + 18) + 'px';
    cursorText.style.top = (e.clientY + 18) + 'px';
}

function hideCursorText() {
    if (!cursorText) return;
    if (cursorTextVisible) {
        cursorText.style.opacity = '0';
        setTimeout(() => { cursorText.style.display = 'none'; }, 200);
        cursorTextVisible = false;
    }
}

function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
}

function createShape(type = null, sizeOverride = null) {
    const shape = document.createElement('div');
    const shapeType = type || SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
    let size = sizeOverride || randomBetween(MIN_SIZE, MAX_SIZE);
    let width = size, height = size;
    
    // Set dimensions based on shape type
    if (shapeType === 'ellipse') {
        width = size * 1.5;
        height = size * 0.8;
    } else if (shapeType === 'blob') {
        width = size;
        height = size;
    }
    
    const left = randomBetween(0, window.innerWidth - width);
    const top = randomBetween(0, window.innerHeight - height);
    const rotate = randomBetween(-15, 15); // Small random rotation
    const opacity = randomBetween(0.7, 1.0); // High opacity for visibility
    
    shape.className = `floating-shape ${shapeType}`;
    shape.style.left = `${left}px`;
    shape.style.top = `${top}px`;
    shape.style.opacity = opacity;
    shape.style.width = `${width}px`;
    shape.style.height = `${height}px`;
    shape.style.transform = `rotate(${rotate}deg)`;
    
    // Apply single color background
    shape.style.background = SHAPE_COLOR;
    
    // Gentle movement with current speed multiplier
    shape._vx = randomBetween(0.1, 0.5) * (Math.random() < 0.5 ? 1 : -1) * currentSpeedMultiplier;
    shape._vy = randomBetween(0.1, 0.5) * (Math.random() < 0.5 ? 1 : -1) * currentSpeedMultiplier;
    shape._vr = randomBetween(-0.1, 0.1) * currentSpeedMultiplier; // Slow rotation
    shape._size = size;
    shape._shapeType = shapeType;
    shape._width = width;
    shape._height = height;
    
    // Add click event listener
    shape.addEventListener('click', handleShapeClick);
    
    // Attach hover listeners
    shape.addEventListener('mouseenter', (e) => {
        showCursorText(e);
        // Track mousemove while hovering
        shape.addEventListener('mousemove', showCursorText);
    });
    shape.addEventListener('mouseleave', (e) => {
        hideCursorText();
        shape.removeEventListener('mousemove', showCursorText);
    });
    
    return shape;
}

function handleShapeClick(event) {
    // Only create new shape if we haven't reached the maximum
    if (allShapes.length < MAX_SHAPES) {
        // Create a new random shape at the click position
        const rect = event.target.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        const newShape = createShape();
        newShape.style.left = `${event.clientX - newShape._width/2}px`;
        newShape.style.top = `${event.clientY - newShape._height/2}px`;
        
        const container = document.getElementById('floating-shapes');
        container.appendChild(newShape);
        allShapes.push(newShape);
        
        // Update speed for all shapes
        updateShapeSpeeds();
        
        console.log(`Added shape! Total: ${allShapes.length}/${MAX_SHAPES}`);
    } else {
        console.log(`Maximum shapes reached (${MAX_SHAPES})! Click redo to reset.`);
    }
    
    // Prevent event bubbling
    event.stopPropagation();
}

function updateShapeSpeeds() {
    const totalShapes = allShapes.length;
    
    // Calculate new speed multiplier based on number of shapes
    // Start with base speed, increase with each shape, cap at max speed
    currentSpeedMultiplier = Math.min(
        BASE_SPEED + (totalShapes - SHAPE_COUNT) * SPEED_INCREMENT,
        MAX_SPEED_MULTIPLIER
    );
    
    // Update speed for all existing shapes
    allShapes.forEach(shape => {
        // Update velocity with new speed multiplier
        const originalVx = Math.abs(shape._vx) / (currentSpeedMultiplier / (BASE_SPEED + (totalShapes - SHAPE_COUNT - 1) * SPEED_INCREMENT));
        const originalVy = Math.abs(shape._vy) / (currentSpeedMultiplier / (BASE_SPEED + (totalShapes - SHAPE_COUNT - 1) * SPEED_INCREMENT));
        const originalVr = Math.abs(shape._vr) / (currentSpeedMultiplier / (BASE_SPEED + (totalShapes - SHAPE_COUNT - 1) * SPEED_INCREMENT));
        
        // Preserve direction and apply new speed
        shape._vx = originalVx * Math.sign(shape._vx) * currentSpeedMultiplier;
        shape._vy = originalVy * Math.sign(shape._vy) * currentSpeedMultiplier;
        shape._vr = originalVr * Math.sign(shape._vr) * currentSpeedMultiplier;
    });
    
    console.log(`Total shapes: ${totalShapes}/${MAX_SHAPES}, Speed multiplier: ${currentSpeedMultiplier.toFixed(2)}`);
}

function resetToOriginal() {
    // Stop the current animation
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    const container = document.getElementById('floating-shapes');
    
    // Remove all existing shapes
    allShapes.forEach(shape => {
        if (shape.parentNode) {
            shape.parentNode.removeChild(shape);
        }
    });
    
    // Clear the shapes array
    allShapes = [];
    
    // Reset speed multiplier to base
    currentSpeedMultiplier = BASE_SPEED;
    
    // Create exactly 5 original shapes, one of each type, with original floating behavior
    for (let i = 0; i < SHAPE_TYPES.length; i++) {
        const shape = createShape(SHAPE_TYPES[i]);
        
        // Set original gentle movement (same as initial generation)
        shape._vx = randomBetween(0.1, 0.5) * (Math.random() < 0.5 ? 1 : -1) * BASE_SPEED;
        shape._vy = randomBetween(0.1, 0.5) * (Math.random() < 0.5 ? 1 : -1) * BASE_SPEED;
        shape._vr = randomBetween(-0.1, 0.1) * BASE_SPEED;
        
        container.appendChild(shape);
        allShapes.push(shape);
    }
    
    // Restart animation with new shapes
    animateShapes(allShapes);
    
    console.log(`Reset to original: ${allShapes.length}/${MAX_SHAPES} shapes, Speed multiplier: ${currentSpeedMultiplier.toFixed(2)}`);
}

function animateShapes(shapes) {
    function step() {
        for (const shape of shapes) {
            let left = parseFloat(shape.style.left);
            let top = parseFloat(shape.style.top);
            let width = shape._width;
            let height = shape._height;
            
            // Move with current speed
            left += shape._vx;
            top += shape._vy;
            
            // Bounce on edges (actual viewport boundaries) and change size
            let hitEdge = false;
            if (left <= 0 || left + width >= window.innerWidth) {
                shape._vx *= -1;
                hitEdge = true;
            }
            if (top <= 0 || top + height >= window.innerHeight) {
                shape._vy *= -1;
                hitEdge = true;
            }
            
            // Change size when hitting edge
            if (hitEdge) {
                const newSize = randomBetween(MIN_SIZE, MAX_SIZE);
                let newWidth = newSize, newHeight = newSize;
                
                // Set dimensions based on shape type
                if (shape._shapeType === 'ellipse') {
                    newWidth = newSize * 1.5;
                    newHeight = newSize * 0.8;
                } else if (shape._shapeType === 'blob') {
                    newWidth = newSize;
                    newHeight = newSize;
                }
                
                shape._size = newSize;
                shape._width = newWidth;
                shape._height = newHeight;
                shape.style.width = `${newWidth}px`;
                shape.style.height = `${newHeight}px`;
            }
            
            // Clamp to viewport boundaries
            left = Math.max(0, Math.min(window.innerWidth - width, left));
            top = Math.max(0, Math.min(window.innerHeight - height, top));
            
            // Rotate slowly
            let rot = parseFloat(shape.style.transform.replace(/[^-0-9.]/g, '')) || 0;
            rot += shape._vr;
            
            shape.style.left = `${left}px`;
            shape.style.top = `${top}px`;
            shape.style.transform = `rotate(${rot}deg)`;
        }
        animationId = requestAnimationFrame(step);
    }
    animationId = requestAnimationFrame(step);
}