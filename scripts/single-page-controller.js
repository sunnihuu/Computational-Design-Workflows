// Single Page Layout Controller
class SinglePageController {
    constructor() {
        this.currentSection = 'home-section';
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
            this.setupHamburgerMenu();
            this.setupScrollSpy();
            this.setupHomeSection();
            this.initializeCanvases();
        });
    }
    
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.setActiveNav(link);
            });
        });
    }
    
    setupHamburgerMenu() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const dropdown = document.querySelector('.burger-menu-dropdown');

        if (hamburgerMenu && dropdown) {
            hamburgerMenu.addEventListener('click', () => {
                hamburgerMenu.classList.toggle('open');
                dropdown.classList.toggle('open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburgerMenu.contains(e.target) && !dropdown.contains(e.target)) {
                    hamburgerMenu.classList.remove('open');
                    dropdown.classList.remove('open');
                }
            });

            // Close menu when clicking on a nav link
            dropdown.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburgerMenu.classList.remove('open');
                    dropdown.classList.remove('open');
                });
            });
        }
    }
    
    setupScrollSpy() {
        const sections = document.querySelectorAll('.content-section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current link
                    if (correspondingLink) {
                        correspondingLink.classList.add('active');
                    }
                    
                    this.currentSection = sectionId;
                    this.handleSectionChange(sectionId);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-50px 0px -50px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    setActiveNav(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    setupHomeSection() {
        // Feature card navigation
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const section = card.getAttribute('data-section');
                if (section) {
                    this.scrollToSection(`${section}-section`);
                }
            });
        });
        
        // Explore button
        const exploreButton = document.getElementById('explore-button');
        if (exploreButton) {
            exploreButton.addEventListener('click', () => {
                this.scrollToSection('spatial-section');
            });
        }
        
        // Add entrance animations
        this.animateHomeElements();
    }
    
    animateHomeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe home section elements
        const homeElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .feature-card, .cta-container');
        homeElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.animationDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    }
    
    handleSectionChange(sectionId) {
        // Handle section-specific initialization
        switch(sectionId) {
            case 'spatial-section':
                this.initializeSpatialCanvases();
                break;
            case 'temporal-section':
                this.initializeTemporalCanvas();
                break;
            case 'relational-section':
                this.initializeRelationalCanvas();
                break;
            case 'geospatial-section':
                this.initializeGeospatialMap();
                break;
            case 'engagement-section':
                this.initializeEngagementComponents();
                break;
            case 'firebase-section':
                this.initializeFirebaseComponents();
                break;
        }
    }
    
    initializeCanvases() {
        // Initialize all canvases on page load but keep them dormant
        this.setupCanvasPlaceholders();
        
        // Initialize spatial canvases immediately since they're interactive
        setTimeout(() => {
            this.initializeSpatialCanvases();
        }, 1000);
    }
    
    setupCanvasPlaceholders() {
        // Set up canvas elements with placeholder content
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            if (canvas.id.includes('2d') || canvas.id.includes('3d')) {
                // Don't show placeholder for 2D/3D canvases as they'll be initialized
                return;
            }
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f8f9fa';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666';
            ctx.font = '24px Roboto';
            ctx.textAlign = 'center';
            ctx.fillText('Canvas Ready', canvas.width / 2, canvas.height / 2);
        });
    }
    
    initializeSpatialCanvases() {
        console.log('Initializing spatial canvases...');
        
        // Initialize 2D canvases (using original IDs)
        this.initialize2DCanvas('my-canvas', 'play-btn', 'reset-btn', 'text-card-1');
        this.initialize2DCanvas('my-canvas-2', 'play-btn-2', 'reset-btn-2', 'text-card-2');
        
        // Initialize 3D canvases  
        this.initialize3DCanvas('my-canvas-3d-1', 'play-btn-3d-1', 'reset-btn-3d-1');
        this.initialize3DCanvas('my-canvas-3d-2', 'play-btn-3d-2', 'reset-btn-3d-2');
    }
    
    initialize2DCanvas(canvasId, playBtnId, resetBtnId, textCardId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas ${canvasId} not found`);
            return;
        }
        
        // Ensure canvas has proper dimensions
        const wrapper = canvas.parentElement;
        if (wrapper && wrapper.classList.contains('canvas-wrapper')) {
            canvas.width = 900;
            canvas.height = 500;
        }
        
        const playBtn = document.getElementById(playBtnId);
        const resetBtn = document.getElementById(resetBtnId);
        const textCard = document.getElementById(textCardId);
        const ctx = canvas.getContext('2d');
        
        // Set up 2D canvas with hand tracking or interactive dots
        if (canvasId === 'my-canvas') {
            this.setup2DHandTracking(canvas, ctx, playBtn, resetBtn, textCard);
        } else {
            this.setup2DParticleSystem(canvas, ctx, playBtn, resetBtn, textCard);
        }
    }
    
    setup2DHandTracking(canvas, ctx, playBtn, resetBtn, textCard) {
        // Simplified hand tracking setup (adapted from 2d.js)
        const numDots = 150;
        const radius = 7;
        let dots = [];
        let animId = null;
        let isPlaying = false;
        
        // Show text card initially
        if (textCard) {
            textCard.style.display = 'block';
            textCard.classList.remove('hidden');
        }
        
        // Generate random dots
        function setupDots() {
            dots = [];
            for (let i = 0; i < numDots; i++) {
                const x = Math.random() * (canvas.width - 2 * radius) + radius;
                const y = Math.random() * (canvas.height - 2 * radius) + radius;
                const color = `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`;
                dots.push({ x, y, color, restX: x, restY: y, driftX: 0, driftY: 0 });
            }
        }
        
        // Draw dots
        function drawDots() {
            // Clear the entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw dots
            for (const d of dots) {
                ctx.beginPath();
                ctx.arc(d.x, d.y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = d.color;
                ctx.fill();
            }
        }
        
        // Animation loop
        function animate() {
            if (!isPlaying) return;
            
            // Hide text card when playing with smooth transition
            if (textCard) {
                textCard.classList.add('hidden');
            }
            
            // Simple drift animation
            dots.forEach(dot => {
                dot.driftX += (Math.random() - 0.5) * 0.5;
                dot.driftY += (Math.random() - 0.5) * 0.5;
                dot.driftX *= 0.95; // Damping
                dot.driftY *= 0.95;
                
                dot.x = dot.restX + dot.driftX;
                dot.y = dot.restY + dot.driftY;
                
                // Keep in bounds
                if (dot.x < radius) dot.x = radius;
                if (dot.x > canvas.width - radius) dot.x = canvas.width - radius;
                if (dot.y < radius) dot.y = radius;
                if (dot.y > canvas.height - radius) dot.y = canvas.height - radius;
            });
            
            drawDots();
            animId = requestAnimationFrame(animate);
        }
        
        // Update button state
        function updateButtonState() {
            if (playBtn) {
                if (isPlaying) {
                    playBtn.classList.add('playing');
                    playBtn.setAttribute('data-state', 'playing');
                    playBtn.setAttribute('aria-label', 'Pause');
                    // Change icon to pause icon
                    playBtn.innerHTML = `
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="6" width="4" height="16" fill="currentColor"/>
                            <rect x="16" y="6" width="4" height="16" fill="currentColor"/>
                        </svg>
                    `;
                } else {
                    playBtn.classList.remove('playing');
                    playBtn.setAttribute('data-state', 'paused');
                    playBtn.setAttribute('aria-label', 'Play');
                    // Change icon back to play icon
                    playBtn.innerHTML = `
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="9,6 22,14 9,22" fill="currentColor"/>
                        </svg>
                    `;
                }
            }
        }
        
        // Initialize
        setupDots();
        drawDots();
        updateButtonState();
        
        // Button handlers with enhanced feedback
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                if (isPlaying) {
                    animate();
                } else {
                    cancelAnimationFrame(animId);
                    if (textCard) {
                        textCard.classList.remove('hidden');
                    }
                }
                updateButtonState();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                isPlaying = false;
                cancelAnimationFrame(animId);
                setupDots();
                drawDots();
                if (textCard) {
                    textCard.classList.remove('hidden');
                }
                updateButtonState();
            });
        }
    }
    
    setup2DParticleSystem(canvas, ctx, playBtn, resetBtn, textCard) {
        // Set up second 2D canvas with different animation
        let particles = [];
        let animId = null;
        let isPlaying = false;
        const numParticles = 50;
        
        // Show text card initially
        if (textCard) {
            textCard.style.display = 'block';
            textCard.classList.remove('hidden');
        }
        
        function setupParticles() {
            particles = [];
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    radius: Math.random() * 8 + 2,
                    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                    alpha: 0.7
                });
            }
        }
        
        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.save();
                ctx.globalAlpha = particle.alpha;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.restore();
            });
        }
        
        function animate() {
            if (!isPlaying) return;
            
            // Hide text card when playing with smooth transition
            if (textCard) {
                textCard.classList.add('hidden');
            }
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off walls with energy loss
                if (particle.x < particle.radius || particle.x > canvas.width - particle.radius) {
                    particle.vx *= -0.8;
                    particle.x = Math.max(particle.radius, Math.min(canvas.width - particle.radius, particle.x));
                }
                if (particle.y < particle.radius || particle.y > canvas.height - particle.radius) {
                    particle.vy *= -0.8;
                    particle.y = Math.max(particle.radius, Math.min(canvas.height - particle.radius, particle.y));
                }
                
                // Add gravity effect
                particle.vy += 0.1;
            });
            
            drawParticles();
            animId = requestAnimationFrame(animate);
        }
        
        // Update button state
        function updateButtonState() {
            if (playBtn) {
                if (isPlaying) {
                    playBtn.classList.add('playing');
                    playBtn.setAttribute('data-state', 'playing');
                    playBtn.setAttribute('aria-label', 'Pause');
                    // Change icon to pause icon
                    playBtn.innerHTML = `
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="6" width="4" height="16" fill="currentColor"/>
                            <rect x="16" y="6" width="4" height="16" fill="currentColor"/>
                        </svg>
                    `;
                } else {
                    playBtn.classList.remove('playing');
                    playBtn.setAttribute('data-state', 'paused');
                    playBtn.setAttribute('aria-label', 'Play');
                    // Change icon back to play icon
                    playBtn.innerHTML = `
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="9,6 22,14 9,22" fill="currentColor"/>
                        </svg>
                    `;
                }
            }
        }
        
        setupParticles();
        drawParticles();
        updateButtonState();
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                if (isPlaying) {
                    animate();
                } else {
                    cancelAnimationFrame(animId);
                    if (textCard) {
                        textCard.classList.remove('hidden');
                    }
                }
                updateButtonState();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                isPlaying = false;
                cancelAnimationFrame(animId);
                setupParticles();
                drawParticles();
                if (textCard) {
                    textCard.classList.remove('hidden');
                }
                updateButtonState();
            });
        }
    }
    
    initialize3DCanvas(canvasId, playBtnId, resetBtnId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas ${canvasId} not found`);
            return;
        }
        
        const playBtn = document.getElementById(playBtnId);
        const resetBtn = document.getElementById(resetBtnId);
        const ctx = canvas.getContext('2d');
        
        // Set up 3D-style visualization
        if (canvasId === 'my-canvas-3d-1') {
            this.setup3DRotatingCubes(canvas, ctx, playBtn, resetBtn);
        } else {
            this.setup3DTruchetTiles(canvas, ctx, playBtn, resetBtn);
        }
    }
    
    setup3DRotatingCubes(canvas, ctx, playBtn, resetBtn) {
        let animId = null;
        let isPlaying = false;
        let time = 0;
        const cubes = [];
        const numCubes = 20;
        
        // Initialize cubes
        for (let i = 0; i < numCubes; i++) {
            cubes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * 200 - 100,
                size: Math.random() * 30 + 10,
                rotX: Math.random() * Math.PI * 2,
                rotY: Math.random() * Math.PI * 2,
                rotZ: Math.random() * Math.PI * 2,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
        
        function draw3DCube(cube) {
            ctx.save();
            ctx.translate(cube.x, cube.y);
            
            // Simple 3D projection
            const perspective = 200 / (200 + cube.z);
            ctx.scale(perspective, perspective);
            
            ctx.rotate(cube.rotX + time * 0.01);
            
            // Draw cube face
            ctx.fillStyle = cube.color;
            ctx.fillRect(-cube.size/2, -cube.size/2, cube.size, cube.size);
            
            // Draw edges for 3D effect
            ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-cube.size/2, -cube.size/2, cube.size, cube.size);
            
            ctx.restore();
        }
        
        function animate() {
            if (!isPlaying) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            time += 1;
            
            cubes.forEach(cube => {
                cube.rotX += 0.02;
                cube.rotY += 0.015;
                cube.z = Math.sin(time * 0.01 + cube.x * 0.01) * 50;
                draw3DCube(cube);
            });
            
            animId = requestAnimationFrame(animate);
        }
        
        // Initial draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cubes.forEach(cube => draw3DCube(cube));
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                if (isPlaying) {
                    animate();
                } else {
                    cancelAnimationFrame(animId);
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                isPlaying = false;
                cancelAnimationFrame(animId);
                time = 0;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cubes.forEach(cube => {
                    cube.rotX = Math.random() * Math.PI * 2;
                    cube.rotY = Math.random() * Math.PI * 2;
                    draw3DCube(cube);
                });
            });
        }
    }
    
    setup3DTruchetTiles(canvas, ctx, playBtn, resetBtn) {
        let animId = null;
        let isPlaying = false;
        let time = 0;
        const tileSize = 40;
        
        function drawTruchetTiles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const cols = Math.ceil(canvas.width / tileSize);
            const rows = Math.ceil(canvas.height / tileSize);
            
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const posX = x * tileSize;
                    const posY = y * tileSize;
                    
                    ctx.save();
                    ctx.translate(posX + tileSize/2, posY + tileSize/2);
                    
                    // Animate rotation based on time and position
                    const rotation = (time * 0.02 + x * 0.1 + y * 0.1) % (Math.PI * 2);
                    ctx.rotate(rotation);
                    
                    // Draw truchet tile pattern
                    ctx.strokeStyle = `hsl(${(x + y + time * 0.1) * 20 % 360}, 70%, 60%)`;
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    
                    ctx.beginPath();
                    ctx.arc(-tileSize/4, -tileSize/4, tileSize/4, 0, Math.PI/2);
                    ctx.stroke();
                    
                    ctx.beginPath();
                    ctx.arc(tileSize/4, tileSize/4, tileSize/4, Math.PI, Math.PI * 1.5);
                    ctx.stroke();
                    
                    ctx.restore();
                }
            }
        }
        
        function animate() {
            if (!isPlaying) return;
            time += 1;
            drawTruchetTiles();
            animId = requestAnimationFrame(animate);
        }
        
        // Initial draw
        drawTruchetTiles();
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                isPlaying = !isPlaying;
                if (isPlaying) {
                    animate();
                } else {
                    cancelAnimationFrame(animId);
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                isPlaying = false;
                cancelAnimationFrame(animId);
                time = 0;
                drawTruchetTiles();
            });
        }
    }
    
    initializeTemporalCanvas() {
        console.log('Initializing temporal canvas...');
        const svg = d3.select("#my-canvas-temporal");
        
        if (svg.empty()) {
            console.warn('Temporal SVG not found');
            return;
        }
        
        // Clear any existing content
        svg.selectAll("*").remove();
        
        // Set up data for temporal visualization
        const data = [];
        const numPoints = 50;
        const width = 900;
        const height = 500;
        
        // Generate time-series data
        for (let i = 0; i < numPoints; i++) {
            data.push({
                time: i,
                value: Math.sin(i * 0.2) * 50 + Math.random() * 20 + height/2,
                category: Math.floor(i / 10)
            });
        }
        
        // Set up scales
        const xScale = d3.scaleLinear()
            .domain([0, numPoints - 1])
            .range([50, width - 50]);
            
        const yScale = d3.scaleLinear()
            .domain([0, height])
            .range([height - 50, 50]);
            
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        
        // Draw background
        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#f8f9fa");
            
        // Draw axes
        svg.append("g")
            .attr("transform", `translate(0, ${height - 50})`)
            .call(d3.axisBottom(xScale));
            
        svg.append("g")
            .attr("transform", "translate(50, 0)")
            .call(d3.axisLeft(yScale));
            
        // Draw line
        const line = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);
            
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#007bff")
            .attr("stroke-width", 2)
            .attr("d", line);
            
        // Draw points
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.time))
            .attr("cy", d => yScale(d.value))
            .attr("r", 4)
            .attr("fill", d => colorScale(d.category))
            .on("mouseover", function(event, d) {
                d3.select(this).attr("r", 6);
            })
            .on("mouseout", function(event, d) {
                d3.select(this).attr("r", 4);
            });
            
        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 30)
            .attr("text-anchor", "middle")
            .attr("font-size", "18px")
            .attr("font-weight", "bold")
            .attr("fill", "#333")
            .text("Temporal Data Visualization");
    }
    
    initializeRelationalCanvas() {
        console.log('Initializing relational canvas...');
        const container = d3.select("#d3-canvas-relational");
        
        if (container.empty()) {
            console.warn('Relational container not found');
            return;
        }
        
        // Clear existing content
        container.selectAll("*").remove();
        
        const width = 900;
        const height = 500;
        
        // Create SVG
        const svg = container.append("svg")
            .attr("width", width)
            .attr("height", height);
            
        // Generate network data
        const nodes = [];
        const links = [];
        const numNodes = 25;
        
        // Create nodes
        for (let i = 0; i < numNodes; i++) {
            nodes.push({
                id: i,
                name: `Node ${i}`,
                group: Math.floor(i / 5),
                x: Math.random() * width,
                y: Math.random() * height
            });
        }
        
        // Create links
        for (let i = 0; i < numNodes; i++) {
            const numConnections = Math.floor(Math.random() * 4) + 1;
            for (let j = 0; j < numConnections; j++) {
                const target = Math.floor(Math.random() * numNodes);
                if (target !== i) {
                    links.push({
                        source: i,
                        target: target,
                        value: Math.random()
                    });
                }
            }
        }
        
        // Set up force simulation
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).distance(50))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2));
            
        // Draw links
        const link = svg.append("g")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", d => Math.sqrt(d.value) * 3);
            
        // Draw nodes
        const node = svg.append("g")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 8)
            .attr("fill", d => d3.schemeCategory10[d.group])
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));
                
        // Add labels
        const labels = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .attr("font-size", "10px")
            .attr("fill", "#333")
            .text(d => d.id);
            
        // Update positions
        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);
                
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
                
            labels
                .attr("x", d => d.x)
                .attr("y", d => d.y);
        });
        
        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }
    
    initializeGeospatialMap() {
        console.log('Initializing geospatial map...');
        
        // Check if Mapbox is loaded
        if (typeof mapboxgl === 'undefined') {
            console.warn('Mapbox GL JS not loaded');
            return;
        }
        
        const container = document.getElementById('mapbox-container-geospatial');
        if (!container) {
            console.warn('Mapbox container not found');
            return;
        }
        
        // You'll need to add your Mapbox access token here
        mapboxgl.accessToken = 'pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV4YW1wbGUifQ.example'; // Replace with your token
        
        try {
            const map = new mapboxgl.Map({
                container: 'mapbox-container-geospatial',
                style: 'mapbox://styles/mapbox/light-v11',
                center: [-74.006, 40.7128], // NYC coordinates
                zoom: 11
            });
            
            map.on('load', () => {
                // Add some sample markers
                const markers = [
                    { lng: -74.006, lat: 40.7128, title: 'Manhattan' },
                    { lng: -73.9442, lat: 40.6782, title: 'Brooklyn' },
                    { lng: -73.8648, lat: 40.7282, title: 'Queens' }
                ];
                
                markers.forEach(marker => {
                    new mapboxgl.Marker()
                        .setLngLat([marker.lng, marker.lat])
                        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${marker.title}</h3>`))
                        .addTo(map);
                });
            });
            
            // Set up search functionality
            const searchInput = document.getElementById('searchFeature');
            const resetBtn = document.getElementById('resetFilters');
            const fitBtn = document.getElementById('fitToData');
            
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    map.flyTo({ center: [-74.006, 40.7128], zoom: 11 });
                });
            }
            
            if (fitBtn) {
                fitBtn.addEventListener('click', () => {
                    map.fitBounds([
                        [-74.2, 40.5],
                        [-73.7, 40.9]
                    ]);
                });
            }
            
        } catch (error) {
            console.warn('Error initializing map:', error);
            container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">Map requires Mapbox access token</div>';
        }
    }
    
    initializeEngagementComponents() {
        console.log('Initializing engagement components...');
        // Set up interactive elements
        this.setupSliders();
        this.setupButtons();
    }
    
    initializeFirebaseComponents() {
        console.log('Initializing Firebase components...');
        
        // Set up vote buttons
        const voteButtons = {
            'vote-shade': document.getElementById('vote-shade'),
            'vote-manageable': document.getElementById('vote-manageable'),
            'vote-hot': document.getElementById('vote-hot'),
            'vote-avoid': document.getElementById('vote-avoid')
        };
        
        const voteCounts = {
            'vote-shade': document.getElementById('shade-count'),
            'vote-manageable': document.getElementById('manageable-count'),
            'vote-hot': document.getElementById('hot-count'),
            'vote-avoid': document.getElementById('avoid-count')
        };
        
        // Initialize counts (you would load these from Firebase in a real app)
        let counts = {
            'vote-shade': Math.floor(Math.random() * 50),
            'vote-manageable': Math.floor(Math.random() * 50),
            'vote-hot': Math.floor(Math.random() * 50),
            'vote-avoid': Math.floor(Math.random() * 50)
        };
        
        // Update display
        Object.keys(counts).forEach(key => {
            if (voteCounts[key]) {
                voteCounts[key].textContent = counts[key];
            }
        });
        
        // Add click handlers
        Object.keys(voteButtons).forEach(buttonId => {
            const button = voteButtons[buttonId];
            if (button) {
                button.addEventListener('click', () => {
                    // Increment count
                    counts[buttonId]++;
                    if (voteCounts[buttonId]) {
                        voteCounts[buttonId].textContent = counts[buttonId];
                        
                        // Add animation effect
                        voteCounts[buttonId].style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            voteCounts[buttonId].style.transform = 'scale(1)';
                        }, 200);
                    }
                    
                    // Show feedback
                    this.showVoteFeedback(button);
                    
                    // In a real app, you would save to Firebase here
                    console.log(`Vote cast for ${buttonId}, new count: ${counts[buttonId]}`);
                });
            }
        });
        
        // Set up neighborhood input
        const neighborhoodInput = document.getElementById('neighborhood');
        if (neighborhoodInput) {
            neighborhoodInput.addEventListener('change', (e) => {
                if (e.target.value) {
                    console.log(`Neighborhood entered: ${e.target.value}`);
                    // In a real app, you would save this to Firebase
                }
            });
        }
    }
    
    showVoteFeedback(button) {
        // Create a temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = 'Vote recorded!';
        feedback.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Position relative to button
        button.style.position = 'relative';
        button.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }
    
    setupSliders() {
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            const valueDisplay = document.getElementById(slider.id + '-demo');
            if (valueDisplay) {
                slider.addEventListener('input', (e) => {
                    valueDisplay.textContent = e.target.value;
                });
            }
        });
    }
    
    setupButtons() {
        // Add click handlers to demo buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            });
        });
    }
}

// Initialize the single page controller
new SinglePageController();
