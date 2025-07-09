// 3D Spatial Canvases page logic

// Load Roboto font
const loadRobotoFont = async () => {
  try {
    // Wait for the font to be available
    await document.fonts.ready;
    
    // Check if Roboto is already loaded
    if (document.fonts.check('400 32px Roboto')) {
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

// 3D Canvas Setup
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('my-canvas');
  if (!canvas) return;
  
  const playBtn = document.getElementById('play-btn');
  const resetBtn = document.getElementById('reset-btn');
  const ctx = canvas.getContext('2d');
  
  // Clear canvas initially
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (playBtn) {
    playBtn.onclick = function() {
      // Play button functionality - currently empty
      console.log('Play button clicked');
    };
  }
  if (resetBtn) {
    resetBtn.onclick = function() {
      // Reset button functionality - clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }
  
  // Second Canvas Setup
  const canvas2 = document.getElementById('my-canvas-2');
  if (canvas2) {
    const playBtn2 = document.getElementById('play-btn-2');
    const resetBtn2 = document.getElementById('reset-btn-2');
    const ctx2 = canvas2.getContext('2d');
    
    // Clear second canvas initially
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    
    if (playBtn2) {
      playBtn2.onclick = function() {
        // Play button functionality for second canvas - currently empty
        console.log('Second canvas play button clicked');
      };
    }
    
    if (resetBtn2) {
      resetBtn2.onclick = function() {
        // Reset button functionality for second canvas - clear canvas
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      };
    }
  }
}); 