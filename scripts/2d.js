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