// 2D Spatial Canvases page logic

// Load Roboto font
const loadRobotoFont = async () => {
  try {
    // Wait for the font to be available
    await document.fonts.ready;
    
    // Check if Roboto is already loaded
    if (document.fonts.check('bold 32px Roboto')) {
      console.log('Roboto font is ready');
      return;
    }
    
    // Load the font if not already available
    const font = new FontFace('Roboto', 'url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2)');
    await font.load();
    document.fonts.add(font);
    console.log('Roboto font loaded successfully');
  } catch (error) {
    console.log('Roboto font loaded from fallback');
  }
};

// Load font when script starts
loadRobotoFont();

// Utility functions
const CanvasUtils = {
  // Text card management
  toggleTextCard: (cardId, show) => {
    const textCard = document.getElementById(cardId);
    if (textCard) {
      textCard.style.display = show ? 'block' : 'none';
    }
  },

  // Key handling
  createKeyHandler: (keys) => {
    return {
      handleKeyDown: (event) => {
        switch(event.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            keys.up = true;
            event.preventDefault();
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            keys.down = true;
            event.preventDefault();
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            keys.left = true;
            event.preventDefault();
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            keys.right = true;
            event.preventDefault();
            break;
        }
      },
      handleKeyUp: (event) => {
        switch(event.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            keys.up = false;
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            keys.down = false;
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            keys.left = false;
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            keys.right = false;
            break;
        }
      }
    };
  },

  // Truchet tiles drawing
  drawTruchetTiles: (ctx, width, height, time = 0, tileSize = 40) => {
    const cols = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);
    
    // Clear background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Draw Truchet tiles
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        const x = col * tileSize;
        const y = row * tileSize;
        
        // Use time and position to determine tile type
        const tileType = Math.floor(Math.sin(time * 0.5 + row * 0.3 + col * 0.2) * 4) % 4;
        const rotation = Math.floor(Math.sin(time * 0.3 + row * 0.4 + col * 0.1) * 4) % 4;
        
        ctx.save();
        ctx.translate(x + tileSize/2, y + tileSize/2);
        ctx.rotate((rotation * Math.PI) / 2);
        
        // Draw different Truchet tile patterns
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        if (tileType === 0) {
          // Quarter circle top-left to bottom-right
          ctx.arc(-tileSize/2, -tileSize/2, tileSize/2, 0, Math.PI/2);
          ctx.arc(tileSize/2, tileSize/2, tileSize/2, Math.PI, 3*Math.PI/2);
        } else if (tileType === 1) {
          // Quarter circle top-right to bottom-left
          ctx.arc(tileSize/2, -tileSize/2, tileSize/2, Math.PI/2, Math.PI);
          ctx.arc(-tileSize/2, tileSize/2, tileSize/2, 3*Math.PI/2, 2*Math.PI);
        } else if (tileType === 2) {
          // Straight lines
          ctx.moveTo(-tileSize/2, 0);
          ctx.lineTo(tileSize/2, 0);
          ctx.moveTo(0, -tileSize/2);
          ctx.lineTo(0, tileSize/2);
        } else {
          // Diagonal lines
          ctx.moveTo(-tileSize/2, -tileSize/2);
          ctx.lineTo(tileSize/2, tileSize/2);
          ctx.moveTo(-tileSize/2, tileSize/2);
          ctx.lineTo(tileSize/2, -tileSize/2);
        }
        
        ctx.stroke();
        ctx.restore();
      }
    }
  },

  // Score display
  drawScore: (ctx, score, canvasWidth, x = null, y = 38) => {
    const text = `Score: ${score}`;
    const textX = x || canvasWidth - 20;
    
    // Measure text for background sizing
    ctx.font = '400 24px Roboto, sans-serif';
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 30;
    const padding = 20;
    
    // Calculate background dimensions
    const bgWidth = textWidth + padding;
    const bgHeight = textHeight;
    const bgX = textX - bgWidth;
    const bgY = y - textHeight + 5;
    
    // Draw background rectangle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
    
    // Draw centered text
    ctx.fillStyle = '#a200ff';
    ctx.font = '400 24px Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, bgX + bgWidth/2, y);
  },

  // Static congratulations text
  drawCongratulations: (ctx, canvasWidth, canvasHeight) => {
    const text = "Congratulations!";
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Ensure font is loaded before drawing
    if (document.fonts.check('400 32px Roboto')) {
      ctx.fillStyle = '#a200ff';
      ctx.font = '400 32px Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, centerX, centerY);
    } else {
      // Fallback to system font if Roboto not available
      ctx.fillStyle = '#a200ff';
      ctx.font = '400 32px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, centerX, centerY);
    }
  }


};

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
    
    // Hide text card when play is clicked
    CanvasUtils.toggleTextCard('text-card-1', false);
    
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
      drawDots();
      animId = requestAnimationFrame(drawVideoToCanvasWithMolecules);
    }
  }

  function resetDotsAndCamera() {
    if (videoElem) {
      videoElem.remove();
      videoElem = null;
    }
    if (hands) {
      hands.close();
      hands = null;
    }
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    handResults = null;
    fingertipPath = [];
    
    // Show text card again
    CanvasUtils.toggleTextCard('text-card-1', true);
    
    // Reset dots to rest positions
    setupDots();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animateIdleDots();
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
  
  // Second Canvas Setup
  const canvas2 = document.getElementById('my-canvas-2');
  if (canvas2) {
    const playBtn2 = document.getElementById('play-btn-2');
    const resetBtn2 = document.getElementById('reset-btn-2');
    const ctx2 = canvas2.getContext('2d');
    
    // Second canvas state
    let canvas2State = {
      isActive: false,
      animationId: null,
      player: {
        x: canvas2.width / 2,
        y: canvas2.height / 2,
        radius: 20,
        speed: 3
      },
      keys: {
        up: false,
        down: false,
        left: false,
        right: false
      },
      squares: [],
      score: 0,
      gradientTime: 0,
      gameWon: false

    };
    
    // Initialize second canvas
    function initCanvas2() {
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      
      // Create static Truchet Tiles background for initialization
      CanvasUtils.drawTruchetTiles(ctx2, canvas2.width, canvas2.height);
      
      // Reset gradient time
      canvas2State.gradientTime = 0;
      
      // Generate random squares
      generateRandomSquares();
    }
    
    // Generate 20 random squares
    function generateRandomSquares() {
      canvas2State.squares = [];
      for (let i = 0; i < 20; i++) {
        const square = {
          x: Math.random() * (canvas2.width - 20),
          y: Math.random() * (canvas2.height - 20),
          size: 15,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
        canvas2State.squares.push(square);
      }
    }
    
    // Start second canvas
    function startCanvas2() {
      if (canvas2State.isActive) return;
      
      canvas2State.isActive = true;
      
      // Hide text card when play is clicked
      CanvasUtils.toggleTextCard('text-card-2', false);
      
      // Start animation loop
      animateCanvas2();
    }
    
    // Stop second canvas
    function stopCanvas2() {
      canvas2State.isActive = false;
      
      if (canvas2State.animationId) {
        cancelAnimationFrame(canvas2State.animationId);
        canvas2State.animationId = null;
      }
      
      // Show text card again
      CanvasUtils.toggleTextCard('text-card-2', true);
      
      // Reset canvas and score
      canvas2State.score = 0;
      canvas2State.gameWon = false;
      initCanvas2();
    }
    
    // Animation loop for second canvas
    function animateCanvas2() {
      if (!canvas2State.isActive) return;
      
      // Update player position based on keys
      updatePlayerMovement();
      
      // Clear canvas
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      
      // Update gradient time
      canvas2State.gradientTime += 0.02;
      
      if (canvas2State.gameWon) {
        // Celebration mode - everything disappears, show static congratulations
        // Simple white background
        ctx2.fillStyle = '#ffffff';
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
        
        // Draw static congratulations text
        CanvasUtils.drawCongratulations(ctx2, canvas2.width, canvas2.height);
      } else {
        // Normal game mode
        // Create Truchet Tiles background
        CanvasUtils.drawTruchetTiles(ctx2, canvas2.width, canvas2.height, canvas2State.gradientTime);
        
        // Draw random squares
        drawSquares();
        
        // Draw pixel human shape at player position
        drawPixelHuman();
        
        // Draw score in upper right corner
        CanvasUtils.drawScore(ctx2, canvas2State.score, canvas2.width);
      }
      
      canvas2State.animationId = requestAnimationFrame(animateCanvas2);
    }
    
    // Draw all squares
    function drawSquares() {
      canvas2State.squares.forEach(square => {
        ctx2.fillStyle = square.color;
        ctx2.fillRect(square.x, square.y, square.size, square.size);
      });
    }
    
    // Update player movement based on pressed keys
    function updatePlayerMovement() {
      if (canvas2State.keys.up) {
        canvas2State.player.y -= canvas2State.player.speed;
      }
      if (canvas2State.keys.down) {
        canvas2State.player.y += canvas2State.player.speed;
      }
      if (canvas2State.keys.left) {
        canvas2State.player.x -= canvas2State.player.speed;
      }
      if (canvas2State.keys.right) {
        canvas2State.player.x += canvas2State.player.speed;
      }
      
      // Keep player within canvas bounds
      canvas2State.player.x = Math.max(canvas2State.player.radius, Math.min(canvas2.width - canvas2State.player.radius, canvas2State.player.x));
      canvas2State.player.y = Math.max(canvas2State.player.radius, Math.min(canvas2.height - canvas2State.player.radius, canvas2State.player.y));
      
      // Check collision with squares
      checkSquareCollisions();
    }
    
    // Check for collisions between player and squares
    function checkSquareCollisions() {
      const player = canvas2State.player;
      
      for (let i = canvas2State.squares.length - 1; i >= 0; i--) {
        const square = canvas2State.squares[i];
        
        // Check if circle overlaps with square
        const closestX = Math.max(square.x, Math.min(player.x, square.x + square.size));
        const closestY = Math.max(square.y, Math.min(player.y, square.y + square.size));
        
        const distanceX = player.x - closestX;
        const distanceY = player.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        if (distanceSquared < player.radius * player.radius) {
          // Collision detected! Remove square and add point
          canvas2State.squares.splice(i, 1);
          canvas2State.score += 1;
          
          // Check if player won (20 points)
          if (canvas2State.score >= 20) {
            canvas2State.gameWon = true;
          }
        }
      }
    }
    
    // Draw pixel human shape
    function drawPixelHuman() {
      // Draw purple circle at player position
      ctx2.fillStyle = '#800080';
      ctx2.beginPath();
      ctx2.arc(canvas2State.player.x, canvas2State.player.y, canvas2State.player.radius, 0, 2 * Math.PI);
      ctx2.fill();
    }
    
    // Button event listeners for second canvas
    if (playBtn2) {
      playBtn2.onclick = function() {
        startCanvas2();
      };
    }
    
    if (resetBtn2) {
      resetBtn2.onclick = function() {
        stopCanvas2();
      };
    }
    
    // Keyboard event listeners for second canvas
    const keyHandler = CanvasUtils.createKeyHandler(canvas2State.keys);
    
    document.addEventListener('keydown', function(event) {
      if (!canvas2State.isActive) return;
      keyHandler.handleKeyDown(event);
    });
    
    document.addEventListener('keyup', function(event) {
      if (!canvas2State.isActive) return;
      keyHandler.handleKeyUp(event);
    });
    
    // Initialize the second canvas
    initCanvas2();
  }
}); 