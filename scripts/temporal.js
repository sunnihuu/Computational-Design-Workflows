// Temporal Structures JavaScript
// Timeline Visualization

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

// Color scale for categories - updated with new colors
const colorScale = d3.scaleOrdinal()
    .domain(['Research', 'Development', 'Milestone'])
    .range(['#4CAF50', '#2196F3', '#F44336']); // 🟢 Research, 🔵 Development, 🔴 Milestone

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

// Calculate optimal label positions to avoid overlap
function calculateLabelPositions(events, timeScale) {
    const positions = [];
    const minSpacing = 80; // Reduced spacing
    
    events.forEach((event, i) => {
        const x = timeScale(event.date);
        let y = height - 190; // Start closer to timeline, moved up 70px total
        let anchor = "middle";
        
        let hasOverlap = true;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (hasOverlap && attempts < maxAttempts) {
            hasOverlap = false;
            
            for (let j = 0; j < i; j++) {
                const prevX = positions[j].x;
                const prevY = positions[j].y;
                
                const horizontalDistance = Math.abs(x - prevX);
                const verticalDistance = Math.abs(y - prevY);
                
                if (horizontalDistance < 150 && verticalDistance < minSpacing) {
                    hasOverlap = true;
                    break;
                }
            }
            
            if (hasOverlap) {
                if (attempts % 3 === 0) {
                    y -= minSpacing; // Move up instead of down
                } else if (attempts % 3 === 1) {
                    if (x < width / 2) {
                        anchor = "start";
                    } else {
                        anchor = "end";
                    }
                } else {
                    y = height - 270; // Move to middle area, moved up 70px total
                }
                attempts++;
            }
        }
        
        positions.push({ x, y, anchor });
    });
    
    return positions;
}

// Show tooltip
function showTooltip(event, d) {
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(44, 62, 80, 0.95)")
        .style("color", "white")
        .style("padding", "12px 16px")
        .style("border-radius", "8px")
        .style("font-size", "13px")
        .style("font-family", "'Roboto', sans-serif")
        .style("font-weight", "400")
        .style("pointer-events", "none")
        .style("z-index", "1000")
        .style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)")
        .style("backdrop-filter", "blur(10px)")
        .style("border", "1px solid rgba(255,255,255,0.1)");

    // Get description based on event name
    let description = "";
    switch(d.name) {
        case 'Initial research on economic complexity at Harvard':
            description = 'Started foundational work on understanding economic complexity and product space theory';
            break;
        case 'First publication of "Atlas of Economic Complexity"':
            description = 'Landmark publication introducing the concept of economic complexity to the world';
            break;
        case 'Launch of the OEC interactive platform':
            description = 'Created the Observatory of Economic Complexity as an interactive data visualization tool';
            break;
        case 'Team moves to MIT and forms Collective Learning Group':
            description = 'Established the Collective Learning Group at MIT to advance complexity research';
            break;
        case 'Bulk data downloads introduced':
            description = 'Made economic complexity data freely available for researchers worldwide';
            break;
        case 'Redesigned platform with new visual tools':
            description = 'Enhanced the OEC platform with improved visualizations and user experience';
            break;
        case 'ESG and carbon data added':
            description = 'Expanded research scope to include environmental, social, and governance metrics';
            break;
        case 'Multilingual and mobile optimization':
            description = 'Made the platform accessible globally with multilingual support and mobile optimization';
            break;
        default:
            description = '';
    }

    tooltip.html(`
        <div style="font-weight: 600; margin-bottom: 6px; color: #fff;">${d.name}</div>
        <div style="font-size: 11px; color: #bdc3c7; margin-bottom: 4px; line-height: 1.4;">${description}</div>
        <div style="font-size: 11px; color: #bdc3c7; margin-bottom: 4px;">Date: ${d.date.toLocaleDateString()}</div>
        <div style="font-size: 11px; color: #bdc3c7;">Category: ${d.category}</div>
    `);

    tooltip.style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - 15) + "px");
}

// Hide tooltip
function hideTooltip() {
    d3.selectAll(".tooltip").remove();
}

// Create timeline visualization
function createTimeline() {
    console.log('createTimeline function called');
    
    if (!initializeSVG()) {
        console.error('Failed to initialize SVG');
        return;
    }
    
    console.log('Creating timeline with events:', events);
    
    // Clear existing content
    console.log('Clearing existing content...');
    svg.selectAll("*").remove();
    console.log('Content cleared');
    
    // Create time scale
    const timeScale = d3.scaleTime()
        .domain(d3.extent(events, d => d.date))
        .range([100, width - 100]);

    // Create time axis
    const xAxis = d3.axisBottom(timeScale)
        .tickFormat(d3.timeFormat('%Y'))
        .ticks(8);

    // Add axis with improved styling
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .style("fill", "#555")
        .style("font-family", "'Roboto', sans-serif");

    // Add axis line styling
    svg.selectAll(".x-axis line")
        .style("stroke", "#ddd")
        .style("stroke-width", 1);

    // Add axis path styling
    svg.selectAll(".x-axis path")
        .style("stroke", "#ddd")
        .style("stroke-width", 2);

    // Draw main timeline line with gradient
    const defs = svg.append("defs");
    
    // Create gradient for timeline
    const timelineGradient = defs.append("linearGradient")
        .attr("id", "timelineGradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    
    timelineGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4CAF50");
    
    timelineGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#2196F3");
    
    timelineGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#F44336");

    // Draw timeline line with gradient and shadow
    svg.append("line")
        .attr("class", "timeline-line")
        .attr("x1", 100)
        .attr("y1", height - 80)
        .attr("x2", width - 100)
        .attr("y2", height - 80)
        .attr("stroke", "url(#timelineGradient)")
        .attr("stroke-width", 4)
        .attr("opacity", 0.8)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Calculate optimal positions for labels to avoid overlap
    const labelPositions = calculateLabelPositions(events, timeScale);

    // Add event points with improved styling
    svg.selectAll(".event-point")
        .data(events)
        .enter()
        .append("circle")
        .attr("class", "event-point")
        .attr("cx", d => timeScale(d.date))
        .attr("cy", height - 80)
        .attr("r", 10)
        .attr("fill", d => colorScale(d.category))
        .attr("stroke", "#fff")
        .attr("stroke-width", 3)
        .style("cursor", "pointer")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.2))")
        .style("transition", "all 0.3s ease");

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

    // Add event labels with calculated positions and text wrapping
    console.log('Creating event labels...');
    svg.selectAll(".event-label-group")
        .data(events)
        .enter()
        .append("g")
        .attr("class", "event-label-group")
        .attr("transform", (d, i) => `translate(${labelPositions[i].x}, ${labelPositions[i].y})`)
        .each(function(d, i) {
            console.log(`Creating label for event ${i}: ${d.name}`);
            const group = d3.select(this);
            const anchor = labelPositions[i].anchor;
            
            // Add event name with text wrapping and improved styling
            const nameLines = wrapText(d.name, 120);
            nameLines.forEach((line, lineIndex) => {
                group.append("text")
                    .attr("class", "event-label")
                    .attr("x", 0)
                    .attr("y", lineIndex * 16)
                    .attr("text-anchor", anchor)
                    .attr("font-size", "13px")
                    .attr("font-weight", "600")
                    .attr("fill", "#2c3e50")
                    .attr("font-family", "'Roboto', sans-serif")
                    .text(line)
                    .style("pointer-events", "none")
                    .style("filter", "drop-shadow(0 1px 2px rgba(255,255,255,0.8))");
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
        .attr("font-family", "'Roboto', sans-serif")
        .text("Economic Complexity Timeline")
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Add subtitle
    svg.append("text")
        .attr("class", "timeline-subtitle")
        .attr("x", width / 2)
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "400")
        .attr("fill", "#666")
        .attr("font-family", "'Roboto', sans-serif")
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