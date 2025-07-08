// Floating Shapes Layer - Separate Module
class FloatingShapesLayer {
    constructor() {
        this.config = {
            types: ['circle', 'rounded-square', 'ellipse', 'diamond', 'blob'],
            count: 5,
            maxCount: 15,
            minSize: 120,
            maxSize: 350,
            color: '#00f0ff',
            hoverColor: '#a200ff'
        };
        
        this.state = {
            shapes: [],
            speedMultiplier: 1.0,
            animationId: null,
            cursorText: null,
            cursorVisible: false
        };
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.createInitialShapes();
            this.startAnimation();
            this.setupEventListeners();
        });
    }
    
    setupElements() {
        this.state.cursorText = document.getElementById('cursor-text');
        this.container = document.getElementById('floating-shapes-layer');
    }
    
    createInitialShapes() {
        this.config.types.forEach(type => {
            const shape = this.createShape(type);
            this.container.appendChild(shape);
            this.state.shapes.push(shape);
        });
    }
    
    createShape(type = null, sizeOverride = null) {
        const shape = document.createElement('div');
        const shapeType = type || this.getRandomItem(this.config.types);
        const size = sizeOverride || this.randomBetween(this.config.minSize, this.config.maxSize);
        const { width, height } = this.getShapeDimensions(shapeType, size);
        
        // Position and style
        const left = this.randomBetween(0, window.innerWidth - width);
        const top = this.randomBetween(0, window.innerHeight - height);
        const rotation = this.randomBetween(-15, 15);
        const opacity = this.randomBetween(0.7, 1.0);
        
        Object.assign(shape.style, {
            left: `${left}px`,
            top: `${top}px`,
            width: `${width}px`,
            height: `${height}px`,
            opacity: opacity,
            transform: `rotate(${rotation}deg)`,
            background: this.config.color
        });
        
        shape.className = `floating-shape ${shapeType}`;
        
        // Calculate speed based on total number of shapes (including this new one)
        const totalShapes = this.state.shapes.length + 1;
        const speedMultiplier = Math.min(0.5 + (totalShapes - 1) * 0.1, 3.0);
        
        // Physics properties with speed based on shape count
        shape._vx = this.randomBetween(0.1, 0.5) * this.randomSign() * speedMultiplier;
        shape._vy = this.randomBetween(0.1, 0.5) * this.randomSign() * speedMultiplier;
        shape._vr = this.randomBetween(-0.1, 0.1) * speedMultiplier;
        shape._size = size;
        shape._type = shapeType;
        shape._width = width;
        shape._height = height;
        
        // Event listeners with original behavior
        this.attachShapeEvents(shape);
        
        return shape;
    }
    
    getShapeDimensions(type, size) {
        switch (type) {
            case 'ellipse':
                return { width: size * 1.5, height: size * 0.8 };
            default:
                return { width: size, height: size };
        }
    }
    
    attachShapeEvents(shape) {
        // Click to add new shape
        shape.addEventListener('click', (e) => this.handleShapeClick(e));
        
        // Hover events with original behavior
        shape.addEventListener('mouseenter', (e) => {
            this.showCursorText(e);
            // Track mousemove while hovering (original behavior)
            shape.addEventListener('mousemove', this.showCursorText.bind(this));
        });
        
        shape.addEventListener('mouseleave', (e) => {
            this.hideCursorText();
            // Remove mousemove listener when leaving
            shape.removeEventListener('mousemove', this.showCursorText.bind(this));
        });
    }
    
    handleShapeClick(event) {
        if (this.state.shapes.length >= this.config.maxCount) {
            console.log(`Maximum shapes reached (${this.config.maxCount})!`);
            return;
        }
        
        const newShape = this.createShape();
        newShape.style.left = `${event.clientX - newShape._width/2}px`;
        newShape.style.top = `${event.clientY - newShape._height/2}px`;
        
        this.container.appendChild(newShape);
        this.state.shapes.push(newShape);
        
        // Speed up ALL shapes (including the new one)
        this.updateAllShapesSpeed();
        
        console.log(`Added shape! Total: ${this.state.shapes.length}/${this.config.maxCount}`);
        
        event.stopPropagation();
    }
    
    updateAllShapesSpeed() {
        const totalShapes = this.state.shapes.length;
        const newSpeedMultiplier = Math.min(0.5 + (totalShapes - 1) * 0.1, 3.0);
        
        this.state.shapes.forEach(shape => {
            // Get the original speed direction and magnitude
            const originalSpeedX = Math.abs(shape._vx);
            const originalSpeedY = Math.abs(shape._vy);
            const originalSpeedR = Math.abs(shape._vr);
            
            // Preserve direction and scale to new speed
            shape._vx = originalSpeedX * Math.sign(shape._vx) * newSpeedMultiplier;
            shape._vy = originalSpeedY * Math.sign(shape._vy) * newSpeedMultiplier;
            shape._vr = originalSpeedR * Math.sign(shape._vr) * newSpeedMultiplier;
        });
        
        console.log(`All shapes sped up to ${newSpeedMultiplier.toFixed(2)}x speed!`);
    }
    
    resetShapes() {
        if (this.state.animationId) {
            cancelAnimationFrame(this.state.animationId);
        }
        
        this.state.shapes.forEach(shape => shape.remove());
        this.state.shapes = [];
        
        this.createInitialShapes();
        this.startAnimation();
    }
    
    startAnimation() {
        const animate = () => {
            this.state.shapes.forEach(shape => this.updateShapePosition(shape));
            this.state.animationId = requestAnimationFrame(animate);
        };
        this.state.animationId = requestAnimationFrame(animate);
    }
    
    updateShapePosition(shape) {
        let left = parseFloat(shape.style.left);
        let top = parseFloat(shape.style.top);
        
        // Update position
        left += shape._vx;
        top += shape._vy;
        
        // Bounce on edges
        let hitEdge = false;
        if (left <= 0 || left + shape._width >= window.innerWidth) {
            shape._vx *= -1;
            hitEdge = true;
        }
        if (top <= 0 || top + shape._height >= window.innerHeight) {
            shape._vy *= -1;
            hitEdge = true;
        }
        
        // Resize on edge hit
        if (hitEdge) {
            const newSize = this.randomBetween(this.config.minSize, this.config.maxSize);
            const { width, height } = this.getShapeDimensions(shape._type, newSize);
            
            shape._size = newSize;
            shape._width = width;
            shape._height = height;
            shape.style.width = `${width}px`;
            shape.style.height = `${height}px`;
        }
        
        // Clamp to viewport
        left = Math.max(0, Math.min(window.innerWidth - shape._width, left));
        top = Math.max(0, Math.min(window.innerHeight - shape._height, top));
        
        // Update rotation
        const currentRotation = parseFloat(shape.style.transform.replace(/[^-0-9.]/g, '')) || 0;
        const newRotation = currentRotation + shape._vr;
        
        // Apply changes
        shape.style.left = `${left}px`;
        shape.style.top = `${top}px`;
        shape.style.transform = `rotate(${newRotation}deg)`;
    }
    
    showCursorText(event) {
        if (!this.state.cursorText) return;
        
        if (!this.state.cursorVisible) {
            this.state.cursorText.style.display = 'block';
            this.state.cursorText.style.opacity = '1';
            this.state.cursorVisible = true;
        }
        
        // Offset so it doesn't cover the cursor
        this.state.cursorText.style.left = `${event.clientX + 18}px`;
        this.state.cursorText.style.top = `${event.clientY + 18}px`;
    }
    
    hideCursorText() {
        if (!this.state.cursorText || !this.state.cursorVisible) return;
        
        this.state.cursorText.style.opacity = '0';
        setTimeout(() => {
            this.state.cursorText.style.display = 'none';
            this.state.cursorVisible = false;
        }, 200);
    }
    
    setupEventListeners() {
        // Connect redo button to this layer
        const redoButton = document.getElementById('redo-button');
        if (redoButton) {
            redoButton.addEventListener('click', () => this.resetShapes());
        }
    }
    
    // Utility methods
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    randomSign() {
        return Math.random() < 0.5 ? 1 : -1;
    }
    
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

// Initialize the floating shapes layer
new FloatingShapesLayer(); 