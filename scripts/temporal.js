// Temporal Structures JavaScript
// Timeline Visualization

// SVG setup
let svg, width = 900, height = 500;

function initializeSVG() {
    const container = d3.select("#d3-canvas");
    if (container.empty()) {
        console.error('Container #d3-canvas not found!');
        return false;
    }
    container.selectAll("svg").remove();
    svg = container.append("svg")
        .attr("id", "my-canvas")
        .attr("width", width)
        .attr("height", height);
    return true;
}

function initializeElements() {
    return true;
}

const events = [
    { date: new Date('2009-01-01'), name: 'Initial research on economic complexity at Harvard', category: 'Research' },
    { date: new Date('2011-01-01'), name: 'First publication of "Atlas of Economic Complexity"', category: 'Research' },
    { date: new Date('2013-01-01'), name: 'Launch of the OEC interactive platform', category: 'Milestone' },
    { date: new Date('2015-01-01'), name: 'Team moves to MIT and forms Collective Learning Group', category: 'Development' },
    { date: new Date('2017-01-01'), name: 'Bulk data downloads introduced', category: 'Development' },
    { date: new Date('2020-01-01'), name: 'Redesigned platform with new visual tools', category: 'Milestone' },
    { date: new Date('2022-01-01'), name: 'ESG and carbon data added', category: 'Development' },
    { date: new Date('2023-01-01'), name: 'Multilingual and mobile optimization', category: 'Milestone' }
];

const colorScale = d3.scaleOrdinal()
    .domain(['Research', 'Development', 'Milestone'])
    .range(['#4CAF50', '#2196F3', '#F44336']);

function wrapText(text, width) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine + ' ' + word;
        const testWidth = testLine.length * 6;
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

function calculateLabelPositions(events, timeScale) {
    const positions = [];
    const minSpacing = 80;
    events.forEach((event, i) => {
        const x = timeScale(event.date);
        let y = height - 190;
        let anchor = "middle";
        let hasOverlap = true, attempts = 0, maxAttempts = 10;
        while (hasOverlap && attempts < maxAttempts) {
            hasOverlap = false;
            for (let j = 0; j < i; j++) {
                const { x: prevX, y: prevY } = positions[j];
                if (Math.abs(x - prevX) < 150 && Math.abs(y - prevY) < minSpacing) {
                    hasOverlap = true;
                    break;
                }
            }
            if (hasOverlap) {
                if (attempts % 3 === 0) y -= minSpacing;
                else if (attempts % 3 === 1) anchor = x < width / 2 ? "start" : "end";
                else y = height - 270;
                attempts++;
            }
        }
        positions.push({ x, y, anchor });
    });
    return positions;
}

function showTooltip(event, d) {
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(44, 62, 80, 0.95)")
        .style("color", "white")
        .style("padding", "12px 16px")
        .style("border-radius", "8px")
        .style("font-size", "13px")
        .style("pointer-events", "none")
        .style("z-index", "1000")
        .style("box-shadow", "0 4px 12px rgba(0,0,0,0.3)")
        .style("backdrop-filter", "blur(10px)")
        .style("border", "1px solid rgba(255,255,255,0.1)");

    const descriptions = {
        'Initial research on economic complexity at Harvard': 'Started foundational work on understanding economic complexity and product space theory',
        'First publication of "Atlas of Economic Complexity"': 'Landmark publication introducing the concept of economic complexity to the world',
        'Launch of the OEC interactive platform': 'Created the Observatory of Economic Complexity as an interactive data visualization tool',
        'Team moves to MIT and forms Collective Learning Group': 'Established the Collective Learning Group at MIT to advance complexity research',
        'Bulk data downloads introduced': 'Made economic complexity data freely available for researchers worldwide',
        'Redesigned platform with new visual tools': 'Enhanced the OEC platform with improved visualizations and user experience',
        'ESG and carbon data added': 'Expanded research scope to include environmental, social, and governance metrics',
        'Multilingual and mobile optimization': 'Made the platform accessible globally with multilingual support and mobile optimization'
    };

    tooltip.html(`
        <div style="font-weight: 600; margin-bottom: 6px;">${d.name}</div>
        <div style="font-size: 11px; color: #bdc3c7;">${descriptions[d.name]}</div>
        <div style="font-size: 11px; color: #bdc3c7;">Date: ${d.date.toLocaleDateString()}</div>
        <div style="font-size: 11px; color: #bdc3c7;">Category: ${d.category}</div>
    `).style("left", `${event.pageX + 15}px`).style("top", `${event.pageY - 15}px`);
}

function hideTooltip() {
    d3.selectAll(".tooltip").remove();
}

function createTimeline() {
    if (!initializeSVG()) return;
    svg.selectAll("*").remove();

    const timeScale = d3.scaleTime()
        .domain(d3.extent(events, d => d.date))
        .range([100, width - 100]);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - 50})`)
        .call(d3.axisBottom(timeScale).tickFormat(d3.timeFormat('%Y')).ticks(8))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "14px");

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "timelineGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#4CAF50");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "#2196F3");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#F44336");

    svg.append("line")
        .attr("x1", 100).attr("y1", height - 80)
        .attr("x2", width - 100).attr("y2", height - 80)
        .attr("stroke", "url(#timelineGradient)")
        .attr("stroke-width", 4);

    const labelPositions = calculateLabelPositions(events, timeScale);

    svg.selectAll(".event-point")
        .data(events)
        .enter().append("circle")
        .attr("class", "event-point")
        .attr("cx", d => timeScale(d.date))
        .attr("cy", height - 80)
        .attr("r", 10)
        .attr("fill", d => colorScale(d.category))
        .on("mouseover", function(event, d) {
            d3.select(this).transition().attr("r", 15);
            showTooltip(event, d);
        })
        .on("mouseout", function() {
            d3.select(this).transition().attr("r", 10);
            hideTooltip();
        });

    svg.selectAll(".connector-line")
        .data(events)
        .enter().append("line")
        .attr("x1", d => timeScale(d.date))
        .attr("y1", height - 80)
        .attr("x2", d => timeScale(d.date))
        .attr("y2", (d, i) => labelPositions[i].y + 20)
        .attr("stroke", "#e0e0e0").attr("stroke-dasharray", "5,5");

    svg.selectAll(".event-label-group")
        .data(events)
        .enter().append("g")
        .attr("class", "event-label-group")
        .attr("transform", (d, i) => `translate(${labelPositions[i].x}, ${labelPositions[i].y})`)
        .each(function(d, i) {
            const group = d3.select(this);
            const lines = wrapText(d.name, 120);
            lines.forEach((line, index) => {
                group.append("text")
                    .attr("x", 0)
                    .attr("y", index * 16)
                    .attr("text-anchor", labelPositions[i].anchor)
                    .attr("font-size", "13px")
                    .text(line);
            });
        });

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "28px")
        .text("Economic Complexity Timeline");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 60)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("Research milestones and developments from 2009 to 2023");

    const legend = svg.append("g")
        .attr("transform", `translate(20, 80)`);
    const legendData = ['Research', 'Development', 'Milestone'];
    legend.selectAll(".legend-item")
        .data(legendData)
        .enter().append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 30})`)
        .each(function(d) {
            d3.select(this).append("circle")
                .attr("r", 8)
                .attr("fill", colorScale(d));
            d3.select(this).append("text")
                .attr("x", 20)
                .attr("y", 4)
                .attr("font-size", "13px")
                .text(d);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof d3 === 'undefined') {
        console.error('D3.js is not loaded!');
        return;
    }
    if (window.timelineCreated) return;
    if (!initializeElements()) return;
    createTimeline();
    window.timelineCreated = true;
});