// Temporal Structures JavaScript
// D3.js Force-directed Graph

// SVG setup
let svg, width = 900, height = 500;

function initializeSVG() {
    svg = d3.select("#my-canvas");
    if (svg.empty()) {
        console.error('SVG element #my-canvas not found!');
        return false;
    }
    console.log('SVG element found:', svg.node());
    return true;
}

// Button elements
let playBtn, resetBtn, textCard;

function initializeElements() {
    playBtn = document.getElementById('play-btn');
    resetBtn = document.getElementById('reset-btn');
    textCard = document.getElementById('text-card-1');
    
    if (!playBtn || !resetBtn || !textCard) {
        console.error('Required elements not found:', {
            playBtn: !!playBtn,
            resetBtn: !!resetBtn,
            textCard: !!textCard
        });
        return false;
    }
    
    console.log('All elements found successfully');
    return true;
}

// Animation state
let isPlaying = false;
let simulation;

// Generate random data for the force-directed graph
function generateGraphData() {
    const nodes = [];
    const links = [];
    
    // Create nodes
    const numNodes = 20;
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            id: i,
            group: Math.floor(Math.random() * 4)
        });
    }
    
    // Create links
    const numLinks = 30;
    for (let i = 0; i < numLinks; i++) {
        const source = Math.floor(Math.random() * numNodes);
        const target = Math.floor(Math.random() * numNodes);
        if (source !== target) {
            links.push({
                source: source,
                target: target,
                value: Math.random() * 5 + 1
            });
        }
    }
    
    return { nodes, links };
}

// Specify the color scale
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Create force simulation
function createForceGraph() {
    if (!initializeSVG()) {
        console.error('Failed to initialize SVG');
        return;
    }
    
    const data = generateGraphData();
    console.log('Generated data:', data);
    
    // Clear existing content
    svg.selectAll("*").remove();
    
    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map(d => ({...d}));
    const nodes = data.nodes.map(d => ({...d}));

    // Create a simulation with several forces.
    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll()
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", d => color(d.group));

    node.append("title")
        .text(d => d.id);

    // Add a drag behavior.
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it's no longer being dragged.
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}

// Setup event listeners
function setupEventListeners() {
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
            playBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="6" width="4" height="16" fill="currentColor"/><rect x="16" y="6" width="4" height="16" fill="currentColor"/></svg>';
            textCard.style.display = 'none';
            if (simulation) {
                simulation.alpha(1).restart();
            }
        } else {
            playBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="9,6 22,14 9,22" fill="currentColor"/></svg>';
            textCard.style.display = 'block';
            if (simulation) {
                simulation.stop();
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        isPlaying = false;
        playBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="9,6 22,14 9,22" fill="currentColor"/></svg>';
        textCard.style.display = 'block';
        if (simulation) {
            simulation.stop();
        }
        createForceGraph();
    });
}

// Wait for DOM and D3.js to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if D3.js is loaded
    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded!');
        return;
    }
    
    console.log('D3.js version:', d3.version);
    
    // Initialize elements
    if (!initializeElements()) {
        console.error('Failed to initialize elements');
        return;
    }
    
    console.log('Creating force-directed graph...');
    createForceGraph();
    console.log('Force-directed graph created successfully!');
    
    // Add event listeners after initialization
    setupEventListeners();
}); 