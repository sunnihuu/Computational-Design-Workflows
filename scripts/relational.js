// Relational Networks Visualization
console.log('Relational.js loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeRelationalVisualization();
});

function initializeRelationalVisualization() {
    console.log('Initializing relational collapsible tree visualization...');
    
    // Select the container
    const container = d3.select("#d3-canvas");
    
    if (container.empty()) {
        console.error('Container #d3-canvas not found');
        return;
    }
    
    // Clear existing content
    container.selectAll("*").remove();
    
    const width = 900;
    const height = 500;
    const margin = { top: 40, right: 120, bottom: 40, left: 200 };
    
    // Create SVG with zoom capability
    const svg = container.append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // Add background with rounded corners
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "#fafafa")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-width", 1)
        .attr("rx", 16)
        .attr("ry", 16);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // Define hierarchical data structure for collapsible tree
    const hierarchicalData = {
        name: "OEC Website Home",
        children: [
            {
                name: "Core Entities",
                children: [
                    { name: "Countries", description: "National economies and territories" },
                    { name: "Geographic Regions", description: "Continental and regional groupings" },
                    { name: "Income Levels", description: "Development classifications" }
                ]
            },
            {
                name: "Trade Systems",
                children: [
                    { name: "Trade Data", description: "Import/export transactions" },
                    { name: "Bilateral Trade", description: "Country-to-country flows" },
                    { name: "Trade Flows", description: "Directional movement patterns" },
                    { name: "Trade Balance", description: "Export-import differentials" }
                ]
            },
            {
                name: "Product Ecosystem",
                children: [
                    { name: "Products", description: "Traded product categories" },
                    { name: "Export Markets", description: "Destination markets" },
                    { name: "Import Sources", description: "Origin suppliers" },
                    { name: "Market Share", description: "Competitive positioning" },
                    { name: "Product Space", description: "Product relatedness network" }
                ]
            },
            {
                name: "Economic Analysis",
                children: [
                    { name: "Economic Indicators", description: "GDP, income metrics" },
                    { name: "Complexity Rankings", description: "ECI and PCI indices" },
                    { name: "Diversification", description: "Export portfolio variety" },
                    { name: "Specialization", description: "Comparative advantages" },
                    { name: "Opportunity Gain", description: "Growth potential analysis" },
                    { name: "Competitive Analysis", description: "Market competition metrics" }
                ]
            },
            {
                name: "Analytical Tools",
                children: [
                    { name: "Time Series", description: "Historical trend analysis" },
                    { name: "Network Analysis", description: "Structural relationship metrics" }
                ]
            }
        ]
    };
    
    // Color scheme for different categories with refined colors
    const colorScheme = {
        "Core Entities": "#e74c3c",
        "Trade Systems": "#3498db", 
        "Product Ecosystem": "#2ecc71",
        "Economic Analysis": "#f39c12",
        "Analytical Tools": "#9b59b6"
    };
    
    // Create tree layout with better spacing
    const treeLayout = d3.tree()
        .size([height - margin.top - margin.bottom, width - margin.left - margin.right])
        .separation((a, b) => {
            return a.parent === b.parent ? 1.2 : 1.5;
        });
    
    // Create hierarchy
    const root = d3.hierarchy(hierarchicalData);
    root.x0 = (height - margin.top - margin.bottom) / 2;
    root.y0 = 0;
    
    // Global variables for tree management
    let i = 0;
    const duration = 750;
    
    // Collapse all children initially except the first level
    if (root.children) {
        root.children.forEach(collapse);
    }
    
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    
    // Create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tree-tooltip")
        .style("position", "absolute")
        .style("padding", "10px")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("font-family", "IBM Plex Mono, monospace")
        .style("font-size", "12px")
        .style("z-index", "1000");
    
    // Initialize the tree
    update(root);
    
    function update(source) {
        // Compute the new tree layout
        const treeData = treeLayout(root);
        const nodes = treeData.descendants();
        const links = treeData.descendants().slice(1);
        
        // Normalize for fixed-depth with better spacing
        nodes.forEach(d => {
            d.y = d.depth * 180; // Increased spacing between levels
        });
        
        // Update the nodes
        const node = g.selectAll('g.node')
            .data(nodes, d => d.id || (d.id = ++i));
        
        // Enter any new nodes at the parent's previous position
        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', click);
        
        // Add circles for the nodes with refined styling
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            .style('fill', d => {
                if (d.depth === 0) return "#2c3e50"; // Root node - dark blue
                if (d.depth === 1) return colorScheme[d.data.name] || "#7f8c8d"; // Category nodes
                return "#ffffff"; // Leaf nodes - white
            })
            .style('stroke', d => {
                if (d.depth === 0) return "#34495e";
                if (d.depth === 1) return d3.color(colorScheme[d.data.name]).darker(0.3) || "#95a5a6";
                return d3.color(colorScheme[d.parent.data.name]).darker(0.2) || "#bdc3c7";
            })
            .style('stroke-width', d => d.depth === 0 ? '3px' : '2px')
            .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
        
        // Add labels for the nodes with improved typography
        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d.children || d._children ? -15 : 15)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('font-family', 'IBM Plex Mono, monospace')
            .style('font-size', d => {
                if (d.depth === 0) return '16px';
                if (d.depth === 1) return '13px';
                return '11px';
            })
            .style('font-weight', d => {
                if (d.depth === 0) return '700';
                if (d.depth === 1) return '600';
                return '500';
            })
            .style('fill', d => {
                if (d.depth === 0) return "#2c3e50";
                if (d.depth === 1) return "#2c3e50";
                return "#34495e";
            })
            .style('opacity', 1e-6)
            .style('text-shadow', '1px 1px 2px rgba(255,255,255,0.8)');
        
        // Add hover effects and tooltips with refined interactions
        nodeEnter
            .on('mouseover', function(event, d) {
                d3.select(this).select('circle')
                    .transition()
                    .duration(150)
                    .attr('r', d => {
                        if (d.depth === 0) return 12;
                        if (d.depth === 1) return 10;
                        return 8;
                    })
                    .style('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))');
                
                // Highlight text
                d3.select(this).select('text')
                    .transition()
                    .duration(150)
                    .style('font-weight', d => {
                        if (d.depth === 0) return '800';
                        if (d.depth === 1) return '700';
                        return '600';
                    });
                
                if (d.data.description) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);
                    
                    tooltip.html(`
                        <div style="font-weight: 600; margin-bottom: 4px;">${d.data.name}</div>
                        <div style="font-size: 11px; line-height: 1.4;">${d.data.description}</div>
                    `)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 10) + "px");
                }
            })
            .on('mousemove', function(event) {
                tooltip
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on('mouseout', function(event, d) {
                d3.select(this).select('circle')
                    .transition()
                    .duration(150)
                    .attr('r', d => {
                        if (d.depth === 0) return 8;
                        if (d.depth === 1) return 6;
                        return 5;
                    })
                    .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))');
                
                // Reset text
                d3.select(this).select('text')
                    .transition()
                    .duration(150)
                    .style('font-weight', d => {
                        if (d.depth === 0) return '700';
                        if (d.depth === 1) return '600';
                        return '500';
                    });
                
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
            });
        
        // UPDATE
        const nodeUpdate = nodeEnter.merge(node);
        
        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration(duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);
        
        // Update the node attributes and style with refined sizes
        nodeUpdate.select('circle.node')
            .attr('r', d => {
                if (d.depth === 0) return 8;
                if (d.depth === 1) return 6;
                return 5;
            })
            .style('fill', d => {
                if (d._children) return "#ecf0f1"; // Collapsed nodes are light gray
                if (d.depth === 0) return "#2c3e50";
                if (d.depth === 1) return colorScheme[d.data.name] || "#7f8c8d";
                return "#ffffff";
            })
            .attr('cursor', d => d.children || d._children ? 'pointer' : 'default');
        
        nodeUpdate.select('text')
            .style('opacity', 1);
        
        // Remove any exiting nodes
        const nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .remove();
        
        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
            .attr('r', 1e-6);
        
        // On exit reduce the opacity of text labels
        nodeExit.select('text')
            .style('opacity', 1e-6);
        
        // Update the links
        const link = g.selectAll('path.link')
            .data(links, d => d.id);
        
        // Enter any new links at the parent's previous position with refined styling
        const linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal(o, o);
            })
            .style('fill', 'none')
            .style('stroke', '#bdc3c7')
            .style('stroke-width', '1.5px')
            .style('opacity', 0.7);
        
        // UPDATE
        const linkUpdate = linkEnter.merge(link);
        
        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', d => diagonal(d, d.parent));
        
        // Remove any exiting links
        const linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return diagonal(o, o);
            })
            .remove();
        
        // Store the old positions for transition
        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
        
        // Creates a refined curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            const path = `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x}`;
            return path;
        }
        
        // Toggle children on click
        function click(event, d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }
    
    console.log('Relational collapsible tree visualization initialized successfully');
}
