// Relational Structures JavaScript

let svg, zoom, simulation, nodes, links;

// Node descriptions for popup (add your own descriptions as needed)
const nodeDescriptions = {
    'OEC Platform': { title: 'OEC Platform', category: 'System', description: 'The core platform for economic complexity analysis.' },
    'Data Entities': { title: 'Data Entities', category: 'Module', description: 'Entities such as countries, products, and trade relationships.' },
    'UI Components': { title: 'UI Components', category: 'Module', description: 'Visual and interactive components for data exploration.' },
    'Algorithms & Metrics': { title: 'Algorithms & Metrics', category: 'Module', description: 'Computational methods and metrics like ECI and PCI.' },
    'Theoretical Foundations': { title: 'Theoretical Foundations', category: 'Module', description: 'Theories and concepts underlying the platform.' },
    'Countries': { title: 'Countries', category: 'Component', description: 'Country-level data entities.' },
    'Products': { title: 'Products', category: 'Component', description: 'Product-level data entities.' },
    'Trade Relationships': { title: 'Trade Relationships', category: 'Component', description: 'Trade links between countries and products.' },
    'Time': { title: 'Time', category: 'Component', description: 'Temporal dimension for data analysis.' },
    'Tree Maps': { title: 'Tree Maps', category: 'Component', description: 'Treemap visualizations for hierarchical data.' },
    'Network Diagrams': { title: 'Network Diagrams', category: 'Component', description: 'Network visualizations for relationships.' },
    'Search Tools': { title: 'Search Tools', category: 'Component', description: 'Tools for searching and filtering data.' },
    'Dashboards': { title: 'Dashboards', category: 'Component', description: 'Dashboards for data overview and insights.' },
    'ECI': { title: 'ECI', category: 'Metric', description: 'Economic Complexity Index.' },
    'PCI': { title: 'PCI', category: 'Metric', description: 'Product Complexity Index.' },
    'Data Pipelines': { title: 'Data Pipelines', category: 'Component', description: 'Pipelines for data processing and transformation.' },
    'Economic Complexity Theory': { title: 'Economic Complexity Theory', category: 'Theory', description: 'Theoretical background for economic complexity.' },
    'Modularity': { title: 'Modularity', category: 'Theory', description: 'Concept of modularity in networks and systems.' },
    'Open Access': { title: 'Open Access', category: 'Principle', description: 'Commitment to open data and transparency.' }
};

function getRelationshipDescription(type) {
    switch(type) {
        case 'hierarchy': return 'Hierarchical relationship (parent-child/module-component)';
        case 'dataflow': return 'Data flow between modules or components';
        case 'functional': return 'Functional dependency or computation';
        case 'theoretical': return 'Theoretical or conceptual influence';
        case 'interaction': return 'User or system interaction';
        case 'association': return 'Association or connection';
        case 'conceptual': return 'Conceptual or abstract relationship';
        default: return '';
    }
}

function initD3JS() {
    const container = document.getElementById('d3-canvas');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Set up SVG with zoom support
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 500;
    
    svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('cursor', 'grab');

    // Create zoom behavior
    zoom = d3.zoom()
        .scaleExtent([0.3, 3])
        .on('zoom', zoomed)
        .on('start', () => svg.style('cursor', 'grabbing'))
        .on('end', () => svg.style('cursor', 'grab'));

    // Apply zoom to SVG
    svg.call(zoom);

    // Create main group for all elements (graph only)
    const g = svg.append('g').attr('class', 'graph-group');

    // Create defs for gradients and filters
    const defs = svg.append('defs');
    
    // Create arrow markers for different relationship types
    const relationshipTypes = ['hierarchy', 'dataflow', 'functional', 'theoretical', 'interaction', 'association', 'conceptual'];
    const relationshipColors = ['#1f77b4', '#ff7f0e', '#9467bd', '#2ca02c', '#d62728', '#17becf', '#8c564b'];
    
    const arrowMarkers = defs.selectAll('.arrow-marker')
        .data(relationshipTypes)
        .enter().append('marker')
        .attr('id', d => `arrow-${d}`)
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('xoverflow', 'visible');
    
    arrowMarkers.append('path')
        .attr('d', 'M 0,-4 L 8 ,0 L 0,4')
        .attr('fill', (d, i) => relationshipColors[i])
        .attr('stroke', 'none');
    
    // Create gradients for nodes
    const nodeGradients = defs.selectAll('.node-gradient')
        .data([0, 1, 2, 3, 4])
        .enter().append('linearGradient')
        .attr('id', d => `node-gradient-${d}`)
        .attr('class', 'node-gradient')
        .attr('gradientUnits', 'objectBoundingBox')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');
    
    nodeGradients.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d => {
            const colors = ['#4a4a4a', '#1a75ff', '#ff9933', '#b366ff', '#66cc66'];
            return colors[d];
        });
    
    nodeGradients.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d => {
            const colors = ['#2a2a2a', '#0052cc', '#e67300', '#9933cc', '#4d994d'];
            return colors[d];
        });

    // Create filter for node shadows
    const filter = defs.append('filter')
        .attr('id', 'node-shadow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    
    filter.append('feDropShadow')
        .attr('dx', '0')
        .attr('dy', '3')
        .attr('stdDeviation', '6')
        .attr('flood-opacity', '0.2');

    // Create ontological analysis data structure with optimized sizing
    nodes = [
        // System center
        { id: 'OEC Platform', group: 0, level: 1, radius: 35, x: width / 2, y: height / 2 },
        // Module layer - positioned in a circle around center
        { id: 'Data Entities', group: 1, level: 2, radius: 25, x: width / 2 - 200, y: height / 2 - 150 },
        { id: 'UI Components', group: 2, level: 2, radius: 25, x: width / 2 + 200, y: height / 2 - 150 },
        { id: 'Algorithms & Metrics', group: 3, level: 2, radius: 25, x: width / 2 + 200, y: height / 2 + 150 },
        { id: 'Theoretical Foundations', group: 4, level: 2, radius: 25, x: width / 2 - 200, y: height / 2 + 150 },
        // Component layer - Data Entities
        { id: 'Countries', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 - 250 },
        { id: 'Products', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 - 100 },
        { id: 'Trade Relationships', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 + 50 },
        { id: 'Time', group: 1, level: 3, radius: 18, x: width / 2 - 350, y: height / 2 + 200 },
        // Component layer - UI Components
        { id: 'Tree Maps', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 - 250 },
        { id: 'Network Diagrams', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 - 100 },
        { id: 'Search Tools', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 + 50 },
        { id: 'Dashboards', group: 2, level: 3, radius: 18, x: width / 2 + 350, y: height / 2 + 200 },
        // Component layer - Algorithms & Metrics
        { id: 'ECI', group: 3, level: 3, radius: 18, x: width / 2 + 100, y: height / 2 + 300 },
        { id: 'PCI', group: 3, level: 3, radius: 18, x: width / 2 + 200, y: height / 2 + 300 },
        { id: 'Data Pipelines', group: 3, level: 3, radius: 18, x: width / 2 + 300, y: height / 2 + 300 },
        // Component layer - Theoretical Foundations
        { id: 'Economic Complexity Theory', group: 4, level: 3, radius: 18, x: width / 2 - 100, y: height / 2 + 300 },
        { id: 'Modularity', group: 4, level: 3, radius: 18, x: width / 2 - 200, y: height / 2 + 300 },
        { id: 'Open Access', group: 4, level: 3, radius: 18, x: width / 2 - 300, y: height / 2 + 300 }
    ];

    links = [
        // System to modules (hierarchy)
        { source: 'OEC Platform', target: 'Data Entities', value: 2, type: 'hierarchy', color: '#1f77b4' },
        { source: 'OEC Platform', target: 'UI Components', value: 2, type: 'hierarchy', color: '#1f77b4' },
        { source: 'OEC Platform', target: 'Algorithms & Metrics', value: 2, type: 'hierarchy', color: '#1f77b4' },
        { source: 'OEC Platform', target: 'Theoretical Foundations', value: 2, type: 'hierarchy', color: '#1f77b4' },
        // Modules to components (hierarchy)
        { source: 'Data Entities', target: 'Countries', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Data Entities', target: 'Products', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Data Entities', target: 'Trade Relationships', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Data Entities', target: 'Time', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'UI Components', target: 'Tree Maps', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'UI Components', target: 'Network Diagrams', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'UI Components', target: 'Search Tools', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'UI Components', target: 'Dashboards', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Algorithms & Metrics', target: 'ECI', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Algorithms & Metrics', target: 'PCI', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Algorithms & Metrics', target: 'Data Pipelines', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Theoretical Foundations', target: 'Economic Complexity Theory', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Theoretical Foundations', target: 'Modularity', value: 1, type: 'hierarchy', color: '#1f77b4' },
        { source: 'Theoretical Foundations', target: 'Open Access', value: 1, type: 'hierarchy', color: '#1f77b4' },
        // Cross-module relationships
        { source: 'Data Entities', target: 'Algorithms & Metrics', value: 1.5, type: 'dataflow', color: '#ff7f0e' },
        { source: 'Algorithms & Metrics', target: 'UI Components', value: 1.5, type: 'functional', color: '#9467bd' },
        { source: 'Theoretical Foundations', target: 'Algorithms & Metrics', value: 1.5, type: 'theoretical', color: '#2ca02c' },
        { source: 'UI Components', target: 'Data Entities', value: 1.5, type: 'interaction', color: '#d62728' },
        // Component relationships
        { source: 'Countries', target: 'Products', value: 1, type: 'association', color: '#17becf' },
        { source: 'Countries', target: 'Trade Relationships', value: 1, type: 'association', color: '#17becf' },
        { source: 'Products', target: 'Trade Relationships', value: 1, type: 'association', color: '#17becf' },
        { source: 'ECI', target: 'PCI', value: 1, type: 'functional', color: '#9467bd' },
        { source: 'Economic Complexity Theory', target: 'Modularity', value: 1, type: 'theoretical', color: '#2ca02c' },
        { source: 'Modularity', target: 'Open Access', value: 1, type: 'conceptual', color: '#8c564b' },
        { source: 'Dashboards', target: 'Search Tools', value: 1, type: 'interaction', color: '#d62728' },
        { source: 'Data Pipelines', target: 'Algorithms & Metrics', value: 1, type: 'dataflow', color: '#ff7f0e' }
    ];

    // Create custom color scale
    const color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4])
        .range(['#4a4a4a', '#1a75ff', '#ff9933', '#b366ff', '#66cc66']);

    // Create simulation with better force parameters
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(d => d.value * 80))
        .force('charge', d3.forceManyBody().strength(d => d.level === 1 ? -800 : d.level === 2 ? -400 : -200))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.radius + 10))
        .force('x', d3.forceX().strength(0.1))
        .force('y', d3.forceY().strength(0.1));

    // Create links with better styling
    const link = g.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(links)
        .enter().append('path')
        .attr('stroke', d => d.color)
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => d.value * 1.2)
        .attr('fill', 'none')
        .attr('stroke-linecap', 'round')
        .attr('marker-end', d => `url(#arrow-${d.type})`)
        .style('filter', 'url(#node-shadow)')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('stroke-opacity', 1)
                .attr('stroke-width', d.value * 2);
            
            // Show tooltip
            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0, 0, 0, 0.8)')
                .style('color', 'white')
                .style('padding', '8px 12px')
                .style('border-radius', '6px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('z-index', '1000');
            
            tooltip.html(getRelationshipDescription(d.type))
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .attr('stroke-opacity', 0.6)
                .attr('stroke-width', d.value * 1.2);
            
            d3.select('.tooltip').remove();
        });

    // Create nodes as circles with better styling
    const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => `url(#node-gradient-${d.group})`)
        .attr('stroke', 'none')
        .attr('stroke-width', 0)
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended))
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.radius * 1.15);
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.radius);
        })
        .on('click', function(event, d) {
            showNodeDescription(d);
        });

    // Add text labels to nodes (single layer, no outline)
    const label = g.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#222') // Darker text for clarity
        .attr('font-size', d => d.level === 1 ? '15px' : d.level === 2 ? '13px' : '11px')
        .attr('font-weight', '700')
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .text(d => d.id);

    // Update label positions on simulation tick
    simulation.on('tick', () => {
        link.attr('d', d => {
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate start and end points at node edges
            const sourceRadius = d.source.radius;
            const targetRadius = d.target.radius;
            
            const startX = d.source.x + (dx / dr) * sourceRadius;
            const startY = d.source.y + (dy / dr) * sourceRadius;
            const endX = d.target.x - (dx / dr) * targetRadius;
            const endY = d.target.y - (dy / dr) * targetRadius;
            
            return `M ${startX},${startY} L ${endX},${endY}`;
        });

        // Update node positions
        node.attr('cx', d => d.x)
            .attr('cy', d => d.y);
        // Update label positions (single layer)
        label.attr('x', d => d.x)
            .attr('y', d => d.y);
    });

    // Create legend
    // Expanded color palette for more variety, still calm and modern
    const nodeGradientColors = [
        ['#6a7ba2', '#b8c6e0'], // Calm blue
        ['#7bbfae', '#c6e2dd'], // Soft teal
        ['#b7b6c1', '#e6e6ed'], // Muted lavender/gray
        ['#a7c7a3', '#dbeedb'], // Soft green
        ['#b8b8b8', '#eaeaea'], // Light gray
        ['#bfa7c7', '#e8d6f3'], // Soft purple
        ['#e7b7b6', '#f7e6e6'], // Muted pink
        ['#f7d6b6', '#fbeed6'], // Muted orange
        ['#a7bfc7', '#d6eaf3'], // Soft blue-gray
        ['#b7c7a7', '#e6f3d6']  // Soft olive
    ];
    // Update node gradients for up to 10 groups
    nodeGradients.select('stop[offset="0%"]')
        .attr('stop-color', (d) => nodeGradientColors[d % nodeGradientColors.length][0]);
    nodeGradients.select('stop[offset="100%"]')
        .attr('stop-color', (d) => nodeGradientColors[d % nodeGradientColors.length][1]);

    // Expanded legend colors (match above, but assign to types as needed)
    const legendData = [
        { type: 'hierarchy', color: '#6a7ba2', label: 'Hierarchy' },
        { type: 'dataflow', color: '#7bbfae', label: 'Data Flow' },
        { type: 'functional', color: '#b7b6c1', label: 'Functional' },
        { type: 'theoretical', color: '#a7c7a3', label: 'Theoretical' },
        { type: 'interaction', color: '#bfa7c7', label: 'Interaction' },
        { type: 'association', color: '#e7b7b6', label: 'Association' },
        { type: 'conceptual', color: '#f7d6b6', label: 'Conceptual' },
        { type: 'auxiliary', color: '#a7bfc7', label: 'Auxiliary' },
        { type: 'meta', color: '#b7c7a7', label: 'Meta' }
    ];
    
    // Append legend group directly to SVG so it stays fixed
    const legendGroup = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(20, 20)');
    
    // Add legend background with better styling
    legendGroup.append('rect')
        .attr('width', 200)
        .attr('height', legendData.length * 28 + 35)
        .attr('rx', 12)
        .attr('ry', 12)
        .attr('fill', 'rgba(255, 255, 255, 0.92)')
        .attr('stroke', 'rgba(120, 130, 150, 0.10)')
        .attr('stroke-width', 1.5)
        .style('filter', 'drop-shadow(0 6px 20px rgba(0,0,0,0.15))')
        .style('backdrop-filter', 'blur(10px)');
    
    // Add legend title with better styling
    legendGroup.append('text')
        .attr('x', 100)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '700')
        .attr('fill', '#4a4a4a')
        .attr('font-family', 'Inter, sans-serif')
        .text('Relationship Types');
    
    // Add legend items
    legendGroup.selectAll('.legend-item')
        .data(legendData)
        .enter()
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(20, ${40 + i * 28})`);
    
    // Add colored lines for each legend item with better styling
    legendGroup.selectAll('.legend-item')
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 25)
        .attr('y2', 0)
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3.5)
        .attr('stroke-linecap', 'round')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
    
    // Add arrow markers to legend lines
    legendGroup.selectAll('.legend-item')
        .append('path')
        .attr('d', 'M 25,0 L 20,-4 L 20,4')
        .attr('fill', d => d.color)
        .attr('stroke', 'none')
        .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
    
    // Add labels for each legend item with better styling
    legendGroup.selectAll('.legend-item')
        .append('text')
        .attr('x', 35)
        .attr('y', 4)
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', '#4a4a4a')
        .attr('font-family', 'Inter, sans-serif')
        .text(d => d.label);

    // Improve legend text clarity
    legendGroup.selectAll('text')
        .attr('fill', '#222')
        .attr('font-weight', '700')
        .attr('font-size', '13px');

    // Zoom function
    function zoomed(event) {
        g.attr('transform', event.transform);
    }

    // Double-click to reset zoom
    svg.on('dblclick', function(event) {
        event.preventDefault();
        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
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
    
    // Popup card function
    function showNodeDescription(node) {
        const description = nodeDescriptions[node.id];
        if (!description) return;
        
        // Remove existing popup
        d3.select('.node-popup').remove();
        
        // Get canvas container
        const canvasContainer = document.getElementById('d3-canvas');
        const canvasRect = canvasContainer.getBoundingClientRect();
        
        // Calculate popup position within canvas
        const popupWidth = 400;
        const popupHeight = 300;
        let popupX = node.x + 20; // Offset from node
        let popupY = node.y - popupHeight / 2;
        
        // Ensure popup stays within canvas bounds
        if (popupX + popupWidth > canvasRect.width) {
            popupX = node.x - popupWidth - 20;
        }
        if (popupY < 0) {
            popupY = 10;
        }
        if (popupY + popupHeight > canvasRect.height) {
            popupY = canvasRect.height - popupHeight - 10;
        }
        
        // Create popup container within canvas
        const popup = d3.select('#d3-canvas')
            .append('div')
            .attr('class', 'node-popup')
            .style('position', 'absolute')
            .style('top', popupY + 'px')
            .style('left', popupX + 'px')
            .style('background', '#fff')
            .style('border-radius', '18px')
            .style('padding', '22px')
            .style('box-shadow', '0 8px 32px rgba(106, 123, 162, 0.18)')
            .style('width', popupWidth + 'px')
            .style('z-index', '1000')
            .style('border', '1px solid #e0e6f0')
            .style('backdrop-filter', 'blur(8px)')
            .style('animation', 'popupFadeIn 0.3s ease-out')
            .style('pointer-events', 'auto');
        
        // Add category badge
        popup.append('div')
            .attr('class', 'popup-category')
            .style('background', '#6a7ba2')
            .style('color', '#fff')
            .style('padding', '7px 16px')
            .style('border-radius', '15px')
            .style('font-size', '11px')
            .style('font-weight', '700')
            .style('display', 'block')
            .style('text-align', 'center')
            .style('margin-bottom', '14px')
            .style('text-transform', 'uppercase')
            .style('letter-spacing', '0.5px')
            .text(description.category);
        
        // Add title
        popup.append('h3')
            .attr('class', 'popup-title')
            .style('font-size', '19px')
            .style('font-weight', '700')
            .style('color', '#222')
            .style('margin-bottom', '13px')
            .style('line-height', '1.3')
            .style('text-align', 'center')
            .style('font-family', "'Roboto', 'Inter', sans-serif")
            .text(description.title);
        
        // Add description
        popup.append('p')
            .attr('class', 'popup-description')
            .style('font-size', '14px')
            .style('line-height', '1.5')
            .style('color', '#444')
            .style('margin-bottom', '17px')
            .style('max-height', '120px')
            .style('overflow-y', 'auto')
            .style('text-align', 'center')
            .style('font-family', "'Roboto', 'Inter', sans-serif")
            .text(description.description);
        
        // Add close button
        popup.append('button')
            .attr('class', 'popup-close')
            .style('background', '#6a7ba2')
            .style('color', '#fff')
            .style('border', 'none')
            .style('padding', '8px 18px')
            .style('border-radius', '20px')
            .style('font-size', '13px')
            .style('font-weight', '700')
            .style('cursor', 'pointer')
            .style('transition', 'all 0.3s ease')
            .style('box-shadow', '0 4px 15px rgba(106, 123, 162, 0.13)')
            .style('display', 'block')
            .style('margin', '0 auto')
            .text('×')
            .on('click', () => {
                popup.remove();
            })
            .on('mouseover', function() {
                d3.select(this)
                    .style('transform', 'scale(1.08)')
                    .style('box-shadow', '0 8px 24px rgba(106, 123, 162, 0.18)');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .style('transform', 'scale(1)')
                    .style('box-shadow', '0 4px 15px rgba(106, 123, 162, 0.13)');
            });
    }
    
    // Close popup when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.node-popup') && !event.target.closest('.nodes circle')) {
            d3.select('.node-popup').remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initD3JS();
    console.log('Relational Structures page loaded');
}); 