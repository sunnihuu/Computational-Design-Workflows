// Animated Perlin noise dot grid background for index.html (refined)
// Uses p5.js
let xScale = 0.012;
let yScale = 0.014;
let gap = 40;
let offset = 0;

function setup() {
  let c = createCanvas(windowWidth, windowHeight);
  c.id('noise-bg-canvas');
  c.style('position', 'fixed');
  c.style('top', '0');
  c.style('left', '0');
  c.style('z-index', '-10');
  c.style('pointer-events', 'none');
  c.style('display', 'block');
  noStroke();
}

function windowResized() {
  createCanvas(800, 600);
}

function draw() {
  clear();
  offset += 0.35;
  // Use mouseX and mouseY to shift the noise field interactively
  let mx = map(mouseX, 0, width, -100, 100);
  let my = map(mouseY, 0, height, -100, 100);
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      let noiseValue = noise((x + offset + mx) * xScale, (y + offset + my) * yScale);
      let diameter = noiseValue * gap * 0.95 + 2;
      // Soft, subtle color for modern look
      fill(30, 40, 90, 32 + 32 * noiseValue);
      circle(x, y, diameter);
    }
  }
}
