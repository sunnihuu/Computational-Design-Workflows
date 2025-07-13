// Temporal Structures JavaScript
// Single canvas with time-based animations

// Canvas setup
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

// Button elements
const playBtn = document.getElementById('play-btn');
const resetBtn = document.getElementById('reset-btn');

// Text card
const textCard = document.getElementById('text-card-1');

// Animation state
let isPlaying = false;
let animationId;

// Time-based variables
let time = 0;
const timeScale = 0.02;

// Temporal Animation
class TemporalAnimation {
    constructor() {
        this.particles = [];
        this.patterns = [];
        this.time = 0;
        this.init();
    }

    init() {
        // Create particles for temporal animation
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 4 + 2,
                hue: Math.random() * 360,
                phase: Math.random() * Math.PI * 2
            });
        }

        // Create time-based patterns
        this.patterns = [
            { type: 'wave', x: 100, y: 100, amplitude: 50, frequency: 0.02 },
            { type: 'spiral', x: 300, y: 200, radius: 30, speed: 0.03 },
            { type: 'pulse', x: 500, y: 150, size: 20, speed: 0.05 },
            { type: 'oscillate', x: 700, y: 250, range: 40, speed: 0.04 }
        ];
    }

    update() {
        this.time += timeScale;
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Oscillate size based on time
            particle.size = 2 + Math.sin(this.time + particle.phase) * 3;
        });
    }

    draw() {
        // Clear canvas
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw particles
        this.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw time-based connections
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) + 
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                
                if (distance < 100) {
                    const alpha = (100 - distance) / 100 * 0.3;
                    ctx.strokeStyle = `rgba(162, 0, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });

        // Draw patterns
        this.patterns.forEach(pattern => {
            ctx.save();
            ctx.strokeStyle = '#a200ff';
            ctx.lineWidth = 2;
            
            switch (pattern.type) {
                case 'wave':
                    this.drawWave(pattern);
                    break;
                case 'spiral':
                    this.drawSpiral(pattern);
                    break;
                case 'pulse':
                    this.drawPulse(pattern);
                    break;
                case 'oscillate':
                    this.drawOscillate(pattern);
                    break;
            }
            
            ctx.restore();
        });
    }

    drawWave(pattern) {
        ctx.beginPath();
        for (let x = 0; x < 200; x++) {
            const y = pattern.y + Math.sin(x * 0.02 + this.time * pattern.frequency) * pattern.amplitude;
            if (x === 0) {
                ctx.moveTo(pattern.x + x, y);
            } else {
                ctx.lineTo(pattern.x + x, y);
            }
        }
        ctx.stroke();
    }

    drawSpiral(pattern) {
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
            const radius = pattern.radius + angle * 5;
            const x = pattern.x + Math.cos(angle + this.time * pattern.speed) * radius;
            const y = pattern.y + Math.sin(angle + this.time * pattern.speed) * radius;
            if (angle === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    drawPulse(pattern) {
        const size = pattern.size + Math.sin(this.time * pattern.speed) * 15;
        ctx.beginPath();
        ctx.arc(pattern.x, pattern.y, size, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawOscillate(pattern) {
        const offset = Math.sin(this.time * pattern.speed) * pattern.range;
        ctx.beginPath();
        ctx.moveTo(pattern.x - 50, pattern.y + offset);
        ctx.lineTo(pattern.x + 50, pattern.y - offset);
        ctx.stroke();
    }
}

// Initialize animation
const temporalAnimation = new TemporalAnimation();

// Animation loop
function animate() {
    if (isPlaying) {
        temporalAnimation.update();
        temporalAnimation.draw();
    }
    animationId = requestAnimationFrame(animate);
}

// Event listeners
playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="6" width="4" height="16" fill="currentColor"/><rect x="16" y="6" width="4" height="16" fill="currentColor"/></svg>';
        textCard.style.display = 'none';
    } else {
        playBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="9,6 22,14 9,22" fill="currentColor"/></svg>';
        textCard.style.display = 'block';
    }
});

resetBtn.addEventListener('click', () => {
    isPlaying = false;
    playBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="9,6 22,14 9,22" fill="currentColor"/></svg>';
    textCard.style.display = 'block';
    temporalAnimation.init();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Start animation loop
animate();

// Initial draw
temporalAnimation.draw(); 