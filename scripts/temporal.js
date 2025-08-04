// Temporal Structures JavaScript
// Timeline Visualization

// SVG setup

// Responsive SVG setup
let width = 900, height = 500;
let svg;


function initializeSVG() {
    // Use the #d3-canvas container for consistency
    const container = d3.select("#d3-canvas");
    if (container.empty()) {
        console.error('Container #d3-canvas not found!');
        return false;
    }
    container.selectAll("*").remove();
    svg = container.append("svg")
        .attr("id", "my-canvas")
        .attr("width", width)
        .attr("height", height);
    // Add rounded background
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#fafafa")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1)
        .attr("rx", 16)
        .attr("ry", 16);
    return true;
}

function initializeElements() {
    console.log('Elements initialized successfully');
    return true;
}

// Timeline events data
const events = [
    { 
        date: new Date('2009-01-01'), 
        name: 'Initial research on economic complexity at Harvard', 
        category: 'Research'
    },
    { 
        date: new Date('2011-01-01'), 
        name: 'First publication of "Atlas of Economic Complexity"', 
        category: 'Research'
    },
    { 
        date: new Date('2013-01-01'), 
        name: 'Launch of the OEC interactive platform', 
        category: 'Milestone'
    },
    { 
        date: new Date('2015-01-01'), 
        name: 'Team moves to MIT and forms Collective Learning Group', 
        category: 'Development'
    },
    { 
        date: new Date('2017-01-01'), 
        name: 'Bulk data downloads introduced', 
        category: 'Development'
    },
    { 
        date: new Date('2020-01-01'), 
        name: 'Redesigned platform with new visual tools', 
        category: 'Milestone'
    },
    { 
        date: new Date('2022-01-01'), 
        name: 'ESG and carbon data added', 
        category: 'Development'
    },
    { 
        date: new Date('2023-01-01'), 
        name: 'Multilingual and mobile optimization', 
        category: 'Milestone'
    }
];

// Color scale for categories - more vibrant and distinct
const colorScale = d3.scaleOrdinal()
    .domain(['Research', 'Development', 'Milestone'])
    .range(['#00C853', '#2979FF', '#FF1744']); // 🟢 Research, 🔵 Development, 🔴 Milestone

// Text wrapping function
function wrapText(text, width) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const testWidth = testLine.length * 6; // Approximate character width
        
        if (testWidth > width && currentLine !== '') {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    return lines;
}

// Calculate staggered label positions for a more dynamic timeline
function calculateLabelPositions(events, timeScale) {
    const positions = [];
    const yBase = height - 190;
    const yStagger = 60;
    events.forEach((event, i) => {
        const x = timeScale(event.date);
        // Stagger labels above and below the timeline for clarity
        let y = (i % 2 === 0) ? yBase : yBase + yStagger;
        let anchor = "middle";
        if (x < width / 3) anchor = "start";
        if (x > width * 2 / 3) anchor = "end";
        positions.push({ x, y, anchor, up: i % 2 === 0 });
    });
    return positions;
}

// Show tooltip

    // --- Radial (star) timeline ---
    const centerX = width / 2;
    const centerY = height / 2 + 20;
    const innerRadius = 60;
    const outerRadius = 180;
    const angleScale = d3.scaleLinear()
        .domain([0, events.length])
        .range([0, 2 * Math.PI]);

    // Draw radial lines for each event
    svg.selectAll(".radial-line")
        .data(events)
        .enter()
        .append("line")
        .attr("class", "radial-line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", (d, i) => centerX + Math.cos(angleScale(i) - Math.PI/2) * outerRadius)
        .attr("y2", (d, i) => centerY + Math.sin(angleScale(i) - Math.PI/2) * outerRadius)
        .attr("stroke", d => colorScale(d.category))
        .attr("stroke-width", 3)
        .attr("opacity", 0.3);

    // Draw event nodes
    svg.selectAll(".event-point")
        .data(events)
        .enter()
        .append("circle")
        .attr("class", "event-point")
        .attr("cx", (d, i) => centerX + Math.cos(angleScale(i) - Math.PI/2) * outerRadius)
        .attr("cy", (d, i) => centerY + Math.sin(angleScale(i) - Math.PI/2) * outerRadius)
        .attr("r", 16)
        .attr("fill", d => colorScale(d.category))
        .attr("stroke", "#fff")
        .attr("stroke-width", 4)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");

    // Draw event labels (outside the nodes)
    svg.selectAll(".event-label-group")
        .data(events)
        .enter()
        .append("g")
        .attr("class", "event-label-group")
        .attr("transform", (d, i) => {
            const angle = angleScale(i) - Math.PI/2;
            const labelRadius = outerRadius + 40;
            const x = centerX + Math.cos(angle) * labelRadius;
            const y = centerY + Math.sin(angle) * labelRadius;
            return `translate(${x},${y})`;
        })
        .each(function(d, i) {
            const group = d3.select(this);
            const angle = angleScale(i) * 180 / Math.PI - 90;
            // Add a white background rect for clarity
            group.append("rect")
                .attr("x", -90)
                .attr("y", -12)
                .attr("width", 180)
                .attr("height", 28)
                .attr("fill", "#fff")
                .attr("rx", 8)
                .attr("opacity", 0.92)
                .attr("class", "label-bg");
            // Add event name
            group.append("text")
                .attr("class", "event-label")
                .attr("x", 0)
                .attr("y", 8)
                .attr("text-anchor", "middle")
                .attr("font-size", "13px")
                .attr("font-weight", "600")
                .attr("fill", colorScale(d.category))
                .attr("font-family", "IBM Plex Mono, monospace")
                .text(d.name)
                .style("pointer-events", "none");
        });

    // Draw center circle
    svg.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", innerRadius)
        .attr("fill", "#f5f5f5")
        .attr("stroke", "#bbb")
        .attr("stroke-width", 2);

    // Add year labels on the inner circle
    svg.selectAll(".year-label")
        .data(events)
        .enter()
        .append("text")
        .attr("class", "year-label")
        .attr("x", (d, i) => centerX + Math.cos(angleScale(i) - Math.PI/2) * (innerRadius + 10))
        .attr("y", (d, i) => centerY + Math.sin(angleScale(i) - Math.PI/2) * (innerRadius + 10))
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-family", "IBM Plex Mono, monospace")
        .attr("fill", "#888")
        .text(d => d.date.getFullYear());

    // Add interactive tooltips on event nodes
    svg.selectAll(".event-point")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 22);
            showTooltip(event, d);
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 16);
            hideTooltip();
        });
        .attr("class", "event-point-group")
        .attr("transform", d => `translate(${timeScale(d.date)},${height - 80})`)
        .each(function(d) {
            const g = d3.select(this);
            g.append("circle")
                .attr("r", 14)
                .attr("fill", colorScale(d.category))
                .attr("stroke", "#fff")
                .attr("stroke-width", 4)
                .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");
        });

    // Add connecting lines with improved styling
    svg.selectAll(".connector-line")
        .data(events)
        .enter()
        .append("line")
        .attr("class", "connector-line")
        .attr("x1", d => timeScale(d.date))
        .attr("y1", height - 80)
        .attr("x2", d => timeScale(d.date))
        .attr("y2", (d, i) => labelPositions[i].y + 20)
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6)
        .style("stroke-dasharray", "5,5");

    // Add event labels with background, initially hidden, and make them interactive
    const labelGroups = svg.selectAll(".event-label-group")
        .data(events)
        .enter()
        .append("g")
        .attr("class", "event-label-group")
        .attr("transform", (d, i) => `translate(${labelPositions[i].x}, ${labelPositions[i].y})`)
        .style("opacity", 1);

    labelGroups.each(function(d, i) {
        const group = d3.select(this);
        const anchor = labelPositions[i].anchor;
        // Add a white background rect for clarity
        group.append("rect")
            .attr("x", -90)
            .attr("y", -8)
            .attr("width", 180)
            .attr("height", 28)
            .attr("fill", "#fff")
            .attr("rx", 8)
            .attr("opacity", 0.92)
            .attr("class", "label-bg");
        // Add event name with text wrapping and improved styling
        const nameLines = wrapText(d.name, 120);
        nameLines.forEach((line, lineIndex) => {
            group.append("text")
                .attr("class", "event-label")
                .attr("x", 0)
                .attr("y", lineIndex * 16 + 8)
                .attr("text-anchor", anchor)
                .attr("font-size", "13px")
                .attr("font-weight", "600")
                .attr("fill", "#2c3e50")
                .attr("font-family", "IBM Plex Mono, monospace")
                .text(line)
                .style("pointer-events", "none")
                .style("text-shadow", "1px 1px 2px rgba(255,255,255,0.8)");
        });
    });

    // Add hover effects with improved animations
    svg.selectAll(".event-point")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", 15)
                .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.3))");
            // Highlight corresponding label
            const index = events.indexOf(d);
            svg.selectAll(".event-label-group")
                .filter((d, i) => i === index)
                .selectAll("text")
                .transition()
                .duration(300)
                .attr("font-size", "15px")
                .attr("fill", "#1a1a1a");
            showTooltip(event, d);
        })
        .on("mousemove", function(event) {
            // Move tooltip with mouse
            d3.select("body").selectAll(".tooltip")
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", 10)
                .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))");
            // Reset all labels
            svg.selectAll(".event-label-group")
                .selectAll("text")
                .transition()
                .duration(300)
                .attr("font-size", "13px")
                .attr("fill", "#2c3e50");
            hideTooltip();
        });

    // Add title with improved styling
    svg.append("text")
        .attr("class", "timeline-title")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "28px")
        .attr("font-weight", "700")
        .attr("fill", "#1a1a1a")
        .attr("font-family", "IBM Plex Mono, monospace")
        .text("Economic Complexity Timeline")
        .style("text-shadow", "1px 1px 2px rgba(255,255,255,0.8)");

    // Add subtitle
    svg.append("text")
        .attr("class", "timeline-subtitle")
        .attr("x", width / 2)
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "400")
        .attr("fill", "#666")
        .attr("font-family", "IBM Plex Mono, monospace")
        .text("Research milestones and developments from 2009 to 2023");

    // Add legend with improved styling
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(20, 80)`);

    const legendData = [
        { category: 'Research', label: 'Research' },
        { category: 'Development', label: 'Development' },
        { category: 'Milestone', label: 'Milestone' }
    ];

    legend.selectAll(".legend-item")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 30})`)
        .each(function(d) {
            const g = d3.select(this);
            
            g.append("circle")
                .attr("r", 8)
                .attr("fill", colorScale(d.category))
                .attr("stroke", "#fff")
                .attr("stroke-width", 2)
                .style("filter", "drop-shadow(0 1px 3px rgba(0,0,0,0.2))");
            
            g.append("text")
                .attr("x", 20)
                .attr("y", 4)
                .attr("font-size", "13px")
                .attr("font-weight", "500")
                .attr("fill", "#2c3e50")
                .attr("font-family", "'Roboto', sans-serif")
                .text(d.label);
        });
}

// Setup event listeners
function setupEventListeners() {
    // Timeline is static and interactive through hover effects
}

// Wait for DOM and D3.js to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Temporal.js DOMContentLoaded triggered');
    
    // Check if D3.js is loaded
    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded!');
        return;
    }
    
    console.log('D3.js version:', d3.version);
    
    // Check if this script is running multiple times
    if (window.timelineCreated) {
        console.warn('Timeline already created, skipping...');
        return;
    }
    
    // Initialize elements
    if (!initializeElements()) {
        console.error('Failed to initialize elements');
        return;
    }
    
    console.log('Creating timeline...');
    createTimeline();
    window.timelineCreated = true;
    console.log('Timeline created successfully!');
    
    // Add event listeners after initialization
    setupEventListeners();
}); 