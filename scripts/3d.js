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

// Three.js Scene for First Canvas
let scene, camera, renderer, cube;
let animationId;
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;
let cameraDistance = 5;
let cameraAngleX = 0;
let cameraAngleY = 0;

// 3D Canvas Setup
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('my-canvas');
  if (!canvas) return;
  
  const playBtn = document.getElementById('play-btn');
  const resetBtn = document.getElementById('reset-btn');
  
  // Initialize Three.js scene
  function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setClearColor(0xf0f0f0);
    
    // Create a rotating cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xa200ff,
      shininess: 100,
      transparent: true,
      opacity: 0.8
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x00f0ff, 1, 100);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);
    
    // Add some additional geometric shapes
    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(3, 0, 0);
    scene.add(sphere);
    
    const torusGeometry = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff6b6b,
      transparent: true,
      opacity: 0.6
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-3, 0, 0);
    scene.add(torus);
  }
  
  // Update camera position based on mouse interaction
  function updateCamera() {
    const x = cameraDistance * Math.sin(cameraAngleY) * Math.cos(cameraAngleX);
    const y = cameraDistance * Math.sin(cameraAngleX);
    const z = cameraDistance * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);
    
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  }
  
  // Animation loop
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (cube) {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    
    // Rotate all objects in scene
    scene.children.forEach(child => {
      if (child.type === 'Mesh') {
        child.rotation.x += 0.005;
        child.rotation.y += 0.005;
      }
    });
    
    renderer.render(scene, camera);
  }
  
  // Initialize Three.js
  initThreeJS();
  
  // Set up mouse event listeners
  canvas.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    canvas.style.cursor = 'grabbing';
  });
  
  canvas.addEventListener('mousemove', (event) => {
    if (isMouseDown) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      cameraAngleY += deltaX * 0.01;
      cameraAngleX += deltaY * 0.01;
      
      // Clamp vertical rotation to prevent flipping
      cameraAngleX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraAngleX));
      
      updateCamera();
      renderer.render(scene, camera);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  });
  
  canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    canvas.style.cursor = 'grab';
  });
  
  canvas.addEventListener('mouseleave', () => {
    isMouseDown = false;
    canvas.style.cursor = 'grab';
  });
  
  // Set initial cursor style
  canvas.style.cursor = 'grab';
  
  // Render initial static scene
  renderer.render(scene, camera);
  
  if (playBtn) {
    playBtn.onclick = function() {
      // Start animation
      if (!animationId) {
        animate();
      }
      console.log('Three.js animation started');
    };
  }
  
  if (resetBtn) {
    resetBtn.onclick = function() {
      // Stop animation and reset scene
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      
      // Reset cube rotation
      if (cube) {
        cube.rotation.set(0, 0, 0);
      }
      
      // Reset all objects
      scene.children.forEach(child => {
        if (child.type === 'Mesh') {
          child.rotation.set(0, 0, 0);
        }
      });
      
      // Reset camera position
      cameraAngleX = 0;
      cameraAngleY = 0;
      updateCamera();
      renderer.render(scene, camera);
      
      console.log('Three.js scene reset');
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