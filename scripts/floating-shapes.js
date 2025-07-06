// Floating neon shapes for cyberminimalist site with bouncing edge behavior and diverse shapes

const SHAPE_TYPES = ['circle', 'square', 'rect', 'line'];
const SHAPE_COUNT = 18;
const MIN_SIZE = 40;
const MAX_SIZE = 120;
const MIN_SPEED = 0.3;
const MAX_SPEED = 1.2;

function randomBetween(a, b) {
    return Math.random() * (b - a) + a;
}

function createShape(type = null, sizeOverride = null) {
    const shape = document.createElement('div');
    const shapeType = type || SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
    let size = sizeOverride || randomBetween(MIN_SIZE, MAX_SIZE);
    let width = size, height = size;
    if (shapeType === 'rect') {
        height = size * 0.4 + 20;
    } else if (shapeType === 'line') {
        width = size * 2 + 40;
        height = randomBetween(4, 12);
    }
    const left = randomBetween(0, window.innerWidth - width);
    const top = randomBetween(0, window.innerHeight - height);
    const rotate = randomBetween(0, 360);
    shape.className = `floating-shape ${shapeType}`;
    shape.style.left = `${left}px`;
    shape.style.top = `${top}px`;
    shape.style.opacity = randomBetween(0.4, 0.8);
    shape.style.width = `${width}px`;
    shape.style.height = `${height}px`;
    shape.style.transform = `rotate(${rotate}deg)`;
    // Assign velocity and rotation speed
    shape._vx = randomBetween(MIN_SPEED, MAX_SPEED) * (Math.random() < 0.5 ? 1 : -1);
    shape._vy = randomBetween(MIN_SPEED, MAX_SPEED) * (Math.random() < 0.5 ? 1 : -1);
    shape._vr = randomBetween(-0.2, 0.2);
    shape._size = size;
    shape._sizeDir = Math.random() < 0.5 ? 1 : -1;
    shape._shapeType = shapeType;
    return shape;
}

function animateShapes(shapes) {
    function step() {
        for (const shape of shapes) {
            let left = parseFloat(shape.style.left);
            let top = parseFloat(shape.style.top);
            let width, height;
            let size = shape._size;
            // Animate size
            let newSize = size + shape._sizeDir * 0.2;
            if (newSize > MAX_SIZE || newSize < MIN_SIZE) shape._sizeDir *= -1;
            newSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newSize));
            shape._size = newSize;
            if (shape._shapeType === 'rect') {
                width = newSize;
                height = newSize * 0.4 + 20;
                shape.style.width = `${width}px`;
                shape.style.height = `${height}px`;
            } else if (shape._shapeType === 'line') {
                width = newSize * 2 + 40;
                height = randomBetween(4, 12);
                shape.style.width = `${width}px`;
                shape.style.height = `${height}px`;
            } else {
                width = newSize;
                height = newSize;
                shape.style.width = `${width}px`;
                shape.style.height = `${height}px`;
            }
            // Move
            left += shape._vx;
            top += shape._vy;
            // Bounce on edges
            if (left <= 0 || left + width >= window.innerWidth) shape._vx *= -1;
            if (top <= 0 || top + height >= window.innerHeight) shape._vy *= -1;
            // Clamp to viewport
            left = Math.max(0, Math.min(window.innerWidth - width, left));
            top = Math.max(0, Math.min(window.innerHeight - height, top));
            // Rotate
            let rot = parseFloat(shape.style.transform.replace(/[^-0-9.]/g, '')) || 0;
            rot += shape._vr;
            shape.style.left = `${left}px`;
            shape.style.top = `${top}px`;
            shape.style.transform = `rotate(${rot}deg)`;
        }
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('floating-shapes');
    const shapes = [];
    for (let i = 0; i < SHAPE_COUNT; i++) {
        const shape = createShape();
        container.appendChild(shape);
        shapes.push(shape);
    }
    animateShapes(shapes);
});
