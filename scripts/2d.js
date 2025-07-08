// 2D Spatial Canvases page logic

// MediaPipe Hands setup and finger landmark drawing

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('my-canvas');
  if (!canvas) return;
  const playBtn = document.getElementById('play-btn');
  const resetBtn = document.getElementById('reset-btn');
  const ctx = canvas.getContext('2d');
  const numDots = 150;
  const radius = 7;
  let videoElem = null;
  let animId = null;
  let dots = [];
  let hands = null;
  let handResults = null;

  // Generate 150 random dots (molecules) with rest positions and a unique phase for animation
  function setupDots() {
    dots = [];
    for (let i = 0; i < numDots; i++) {
      const x = Math.random() * (canvas.width - 2 * radius) + radius;
      const y = Math.random() * (canvas.height - 2 * radius) + radius;
      const color = `hsl(${Math.floor(Math.random() * 360)}, 90%, 60%)`;
      dots.push({ x, y, color, restX: x, restY: y, driftX: 0, driftY: 0 });
    }
  }

  // Draw dots (molecules)
  function drawDots() {
    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = d.color;
      ctx.fill();
    }
  }

  // Get all visible index fingertip positions (canvas coordinates, mirrored)
  function getFingertipPositions() {
    if (!handResults || !handResults.multiHandLandmarks) return [];
    const tips = [];
    for (const landmarks of handResults.multiHandLandmarks) {
      // Only index finger tip: 8
      const lm = landmarks[8];
      if (lm) {
        tips.push({
          x: (1 - lm.x) * canvas.width, // mirror
          y: lm.y * canvas.height
        });
      }
    }
    return tips;
  }

  // Initial draw: just dots
  setupDots();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Animate idle dots with random drift before play is clicked
  let idleAnimId = null;
  function animateIdleDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const d of dots) {
      // Update drift with larger random walk
      d.driftX += (Math.random() - 0.5) * 1.5;
      d.driftY += (Math.random() - 0.5) * 1.5;
      // Clamp drift to a larger max distance
      const maxDrift = 32;
      d.driftX = Math.max(-maxDrift, Math.min(maxDrift, d.driftX));
      d.driftY = Math.max(-maxDrift, Math.min(maxDrift, d.driftY));
      // Animate toward rest + drift
      d.x += (d.restX + d.driftX - d.x) * 0.10;
      d.y += (d.restY + d.driftY - d.y) * 0.10;
    }
    drawDots();
    idleAnimId = requestAnimationFrame(animateIdleDots);
  }
  animateIdleDots();

  function enableCameraOnCanvas() {
    if (videoElem) return; // Already enabled
    if (idleAnimId) {
      cancelAnimationFrame(idleAnimId);
      idleAnimId = null;
    }
    
    // Hide instructions when play is clicked
    const instructions = document.getElementById('instructions-1');
    if (instructions) {
      instructions.style.display = 'none';
    }
    
    videoElem = document.createElement('video');
    videoElem.autoplay = true;
    videoElem.playsInline = true;
    videoElem.style.display = 'none'; // Hide the video element
    document.body.appendChild(videoElem);
    setupHandTracking();
  }

  function setupHandTracking() {
    hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });
    hands.onResults(results => {
      handResults = results;
    });
    const camera = new window.Camera(videoElem, {
      onFrame: async () => {
        await hands.send({ image: videoElem });
      },
      width: canvas.width,
      height: canvas.height
    });
    camera.start();
    drawVideoToCanvasWithMolecules();
  }

  // Store fingertip path for drawing
  let fingertipPath = [];
  const maxTrailLength = numDots; // One dot per path point

  function drawVideoToCanvasWithMolecules() {
    if (!videoElem || videoElem.readyState < 2) {
      animId = requestAnimationFrame(drawVideoToCanvasWithMolecules);
      return;
    }
    // Calculate aspect ratio fit
    const cw = canvas.width;
    const ch = canvas.height;
    const vw = videoElem.videoWidth;
    const vh = videoElem.videoHeight;
    if (vw && vh) {
      const canvasAspect = cw / ch;
      const videoAspect = vw / vh;
      let drawWidth, drawHeight, dx, dy;
      if (videoAspect > canvasAspect) {
        drawWidth = cw;
        drawHeight = cw / videoAspect;
        dx = 0;
        dy = (ch - drawHeight) / 2;
      } else {
        drawHeight = ch;
        drawWidth = ch * videoAspect;
        dx = (cw - drawWidth) / 2;
        dy = 0;
      }
      ctx.clearRect(0, 0, cw, ch);
      // Flip horizontally (mirror)
      ctx.save();
      ctx.translate(cw, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoElem, dx, dy, drawWidth, drawHeight);
      ctx.restore();
      // Move balls along fingertip path if any, else return to rest
      const tips = getFingertipPositions();
      const now = performance.now() / 1000;
      if (tips.length > 0) {
        // Use only the first hand's index tip for drawing
        const tip = tips[0];
        // Add current tip to path
        fingertipPath.push({ x: tip.x, y: tip.y });
        if (fingertipPath.length > maxTrailLength) fingertipPath.shift();
        // Distribute dots along the path (oldest to newest)
        for (let i = 0; i < dots.length; i++) {
          let target;
          if (i < fingertipPath.length) {
            target = fingertipPath[i];
          } else {
            // If not enough path, use the last known
            target = fingertipPath[fingertipPath.length - 1] || { x: dots[i].x, y: dots[i].y };
          }
          const d = dots[i];
          // Update drift with larger random walk
          d.driftX += (Math.random() - 0.5) * 1.5;
          d.driftY += (Math.random() - 0.5) * 1.5;
          // Clamp drift to a larger max distance
          const maxDrift = 32;
          d.driftX = Math.max(-maxDrift, Math.min(maxDrift, d.driftX));
          d.driftY = Math.max(-maxDrift, Math.min(maxDrift, d.driftY));
          // Animate toward path + drift
          d.x += (target.x + d.driftX - d.x) * 0.18;
          d.y += (target.y + d.driftY - d.y) * 0.18;
        }
      } else {
        // No hand: random drift around rest position and clear path
        fingertipPath = [];
        for (const d of dots) {
          // Update drift with larger random walk
          d.driftX += (Math.random() - 0.5) * 1.5;
          d.driftY += (Math.random() - 0.5) * 1.5;
          // Clamp drift to a larger max distance
          const maxDrift = 32;
          d.driftX = Math.max(-maxDrift, Math.min(maxDrift, d.driftX));
          d.driftY = Math.max(-maxDrift, Math.min(maxDrift, d.driftY));
          // Animate toward rest + drift
          d.x += (d.restX + d.driftX - d.x) * 0.10;
          d.y += (d.restY + d.driftY - d.y) * 0.10;
        }
      }
      drawDots(); // Draw dots on top of video
      animId = requestAnimationFrame(drawVideoToCanvasWithMolecules);
    }
  }

  function resetDotsAndCamera() {
    // Reset dots to original positions
    setupDots();
    fingertipPath = [];
    
    // Show instructions again when reset is clicked
    const instructions = document.getElementById('instructions-1');
    if (instructions) {
      instructions.style.display = 'block';
    }
    
    // Stop camera and hand tracking if active
    if (videoElem) {
      try {
        videoElem.srcObject && videoElem.srcObject.getTracks().forEach(track => track.stop());
      } catch (e) {}
      videoElem.remove();
      videoElem = null;
    }
    if (hands && hands.close) {
      hands.close();
      hands = null;
    }
    handResults = null;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    // Redraw static dots and restart idle animation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    if (!idleAnimId) animateIdleDots();
  }

  if (playBtn) {
    playBtn.onclick = function() {
      enableCameraOnCanvas();
    };
  }
  if (resetBtn) {
    resetBtn.onclick = function() {
      resetDotsAndCamera();
    };
  }
}); 

// Second Canvas - Grid System
document.addEventListener('DOMContentLoaded', function() {
  const canvas2 = document.getElementById('my-canvas-2');
  if (!canvas2) return;
  
  const playBtn2 = document.getElementById('play-btn-2');
  const resetBtn2 = document.getElementById('reset-btn-2');
  const ctx2 = canvas2.getContext('2d');
  
  // Grid configuration
  const gridConfig = {
    cellSize: 20,
    cols: Math.floor(canvas2.width / 20),
    rows: Math.floor(canvas2.height / 20),
    lineColor: '#000000',
    highlightColor: '#a200ff',
    backgroundColor: '#ffffff'
  };
  
  // Grid state
  let gridState = {
    highlightedCells: new Set(),
    isDrawing: false,
    lastCell: null,
    isAnimating: false,
    animationProgress: 0,
    animationSpeed: 0.005
  };
  
  // Initialize grid
  function initGrid() {
    gridConfig.cols = Math.floor(canvas2.width / gridConfig.cellSize);
    gridConfig.rows = Math.floor(canvas2.height / gridConfig.cellSize);
    drawGrid();
  }
  
  // Draw the grid
  function drawGrid() {
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    
    // Draw background
    ctx2.fillStyle = gridConfig.backgroundColor;
    ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    
    // Draw grid lines
    ctx2.strokeStyle = gridConfig.lineColor;
    ctx2.lineWidth = 1;
    
    if (gridState.isAnimating) {
      drawAnimatedGrid();
    } else {
      drawStaticGrid();
    }
    
    // Draw highlighted cells
    drawHighlightedCells();
  }
  
  // Draw static grid (normal grid)
  function drawStaticGrid() {
    // Vertical lines
    for (let x = 0; x <= gridConfig.cols; x++) {
      ctx2.beginPath();
      ctx2.moveTo(x * gridConfig.cellSize, 0);
      ctx2.lineTo(x * gridConfig.cellSize, canvas2.height);
      ctx2.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= gridConfig.rows; y++) {
      ctx2.beginPath();
      ctx2.moveTo(0, y * gridConfig.cellSize);
      ctx2.lineTo(canvas2.width, y * gridConfig.cellSize);
      ctx2.stroke();
    }
  }
  
  // Draw animated grid generation
  function drawAnimatedGrid() {
    const progress = gridState.animationProgress;
    
    // Calculate how many lines to draw based on progress
    const totalLines = gridConfig.cols + gridConfig.rows + 2; // +2 for edges
    const linesToDraw = Math.floor(totalLines * progress);
    
    let lineCount = 0;
    
    // Draw vertical lines progressively
    for (let x = 0; x <= gridConfig.cols && lineCount < linesToDraw; x++) {
      ctx2.beginPath();
      ctx2.moveTo(x * gridConfig.cellSize, 0);
      ctx2.lineTo(x * gridConfig.cellSize, canvas2.height);
      ctx2.stroke();
      lineCount++;
    }
    
    // Draw horizontal lines progressively
    for (let y = 0; y <= gridConfig.rows && lineCount < linesToDraw; y++) {
      ctx2.beginPath();
      ctx2.moveTo(0, y * gridConfig.cellSize);
      ctx2.lineTo(canvas2.width, y * gridConfig.cellSize);
      ctx2.stroke();
      lineCount++;
    }
    
    // Draw dots in completed grid cells
    drawAnimatedDots();
  }
  
  // Generate random dots for the grid
  function generateDots() {
    gridState.dots = [];
    const totalCells = gridConfig.cols * gridConfig.rows;
    const dotCount = Math.floor(totalCells * 0.3); // 30% of cells will have dots
    
    for (let i = 0; i < dotCount; i++) {
      const col = Math.floor(Math.random() * gridConfig.cols);
      const row = Math.floor(Math.random() * gridConfig.rows);
      const x = col * gridConfig.cellSize + gridConfig.cellSize / 2;
      const y = row * gridConfig.cellSize + gridConfig.cellSize / 2;
      const size = Math.random() * 4 + 2; // Random size between 2-6px
      const color = `hsl(${Math.random() * 360}, 70%, 60%)`; // Random color
      
      gridState.dots.push({
        x, y, size, color, col, row,
        opacity: 0,
        targetOpacity: Math.random() * 0.8 + 0.2 // Random final opacity
      });
    }
  }
  
  // Draw animated dots
  function drawAnimatedDots() {
    if (gridState.dots.length === 0) return;
    
    const progress = gridState.animationProgress;
    const totalCells = gridConfig.cols * gridConfig.rows;
    const cellsToShow = Math.floor(totalCells * progress);
    
    gridState.dots.forEach(dot => {
      const cellIndex = dot.row * gridConfig.cols + dot.col;
      if (cellIndex < cellsToShow) {
        // Animate dot appearance
        dot.opacity += (dot.targetOpacity - dot.opacity) * 0.1;
        
        ctx2.save();
        ctx2.globalAlpha = dot.opacity;
        ctx2.fillStyle = dot.color;
        ctx2.beginPath();
        ctx2.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
        ctx2.fill();
        ctx2.restore();
      }
    });
  }
  
  // Draw highlighted cells
  function drawHighlightedCells() {
    ctx2.fillStyle = gridConfig.highlightColor;
    ctx2.globalAlpha = 0.3;
    
    gridState.highlightedCells.forEach(cellKey => {
      const [col, row] = cellKey.split(',').map(Number);
      const x = col * gridConfig.cellSize;
      const y = row * gridConfig.cellSize;
      
      ctx2.fillRect(x, y, gridConfig.cellSize, gridConfig.cellSize);
    });
    
    ctx2.globalAlpha = 1.0;
  }
  
  // Get cell coordinates from mouse position
  function getCellFromMouse(x, y) {
    const col = Math.floor(x / gridConfig.cellSize);
    const row = Math.floor(y / gridConfig.cellSize);
    return { col, row };
  }
  
  // Get cell key for Set operations
  function getCellKey(col, row) {
    return `${col},${row}`;
  }
  
  // Toggle cell highlight
  function toggleCell(col, row) {
    const cellKey = getCellKey(col, row);
    if (gridState.highlightedCells.has(cellKey)) {
      gridState.highlightedCells.delete(cellKey);
    } else {
      gridState.highlightedCells.add(cellKey);
    }
    drawGrid();
  }
  
  // Handle mouse events
  function handleMouseDown(e) {
    const rect = canvas2.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cell = getCellFromMouse(x, y);
    
    if (cell.col >= 0 && cell.col < gridConfig.cols && 
        cell.row >= 0 && cell.row < gridConfig.rows) {
      gridState.isDrawing = true;
      gridState.lastCell = cell;
      toggleCell(cell.col, cell.row);
    }
  }
  
  function handleMouseMove(e) {
    if (!gridState.isDrawing) return;
    
    const rect = canvas2.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cell = getCellFromMouse(x, y);
    
    if (cell.col >= 0 && cell.col < gridConfig.cols && 
        cell.row >= 0 && cell.row < gridConfig.rows &&
        (cell.col !== gridState.lastCell.col || cell.row !== gridState.lastCell.row)) {
      gridState.lastCell = cell;
      toggleCell(cell.col, cell.row);
    }
  }
  
  function handleMouseUp() {
    gridState.isDrawing = false;
    gridState.lastCell = null;
  }
  
  // Clear grid
  function clearGrid() {
    gridState.highlightedCells.clear();
    gridState.isAnimating = false;
    gridState.animationProgress = 0;
    gridState.dots = [];
    drawGrid();
  }
  
  // Start grid generation animation
  function startGridAnimation() {
    gridState.isAnimating = true;
    gridState.animationProgress = 0;
    gridState.highlightedCells.clear();
    
    // Generate dots for the animation
    generateDots();
    
    function animate() {
      if (gridState.animationProgress >= 1) {
        gridState.isAnimating = false;
        gridState.animationProgress = 1;
        drawGrid();
        return;
      }
      
      gridState.animationProgress += gridState.animationSpeed;
      drawGrid();
      requestAnimationFrame(animate);
    }
    
    animate();
  }
  
  // Add event listeners
  canvas2.addEventListener('mousedown', handleMouseDown);
  canvas2.addEventListener('mousemove', handleMouseMove);
  canvas2.addEventListener('mouseup', handleMouseUp);
  canvas2.addEventListener('mouseleave', handleMouseUp);
  
  // Button event listeners
  if (playBtn2) {
    playBtn2.onclick = function() {
      startGridAnimation();
    };
  }
  
  if (resetBtn2) {
    resetBtn2.onclick = function() {
      clearGrid();
    };
  }
  
  // Initialize the grid
  initGrid();
  
  // Start with an empty canvas (no grid visible initially)
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx2.fillStyle = gridConfig.backgroundColor;
  ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
}); 