// Controllable variables
let randomPosition = true;
let randomSize = true;
let useRandomColors = true;
let randomBend = true;
let randomLeaves = true; // New toggle for leaf randomness

// Color palette (fixed or random)
let colors = {
  stem: '#008000',
  center: '#FFD700',
  petal: '#FF6347',
  leaf: '#006400' // Adding a default leaf color
};
// Configurable ranges for flower properties
const flowerConfig = {
  numFlowers: { min: 20, max: 75 },
  flowerScale: { min: 0.5, max: 2 },
  petalWidth: { min: 50, max: 150 },
  petalHeight: { min: 50, max: 150 },
  stemHeight: { min: 50, max: 300 },
  petalCount: { min: 5, max: 20 },
  colorPalette: {
    petalColors: ['#FF6347', '#BA55D3', '#87CEFA', '#3CB371', '#FFD700'], // A diverse array of colors
    variation: 'full' // 'full' for full spectrum, 'mono' for monochromatic
  },
  leafSize: { min: 10, max: 20 }, // Size of the leaves
  stemBend: { min: 1, max: 1 } // Bend of the stem
};

// New randomization functions based on configuration
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function randomColor(palette) {
  if (palette.variation === 'full') {
    return color(random(255), random(255), random(255));
  } else {
    // Monochromatic variation
    const baseColor = random(palette.petalColors);
    return lerpColor(color(baseColor), color(255), random(0.5));
  }
}

function setup() {
  createCanvas(1920, 1080);
  noLoop();
  background('#FFDAB9');

  const numFlowers = round(randomBetween(flowerConfig.numFlowers.min, flowerConfig.numFlowers.max));

  for (let i = 0; i < numFlowers; i++) {
    // Now using our configuration object to determine values
    const flowerScale = randomBetween(flowerConfig.flowerScale.min, flowerConfig.flowerScale.max);
    const stemHeight = randomBetween(flowerConfig.stemHeight.min, flowerConfig.stemHeight.max) * flowerScale;
    const petalWidth = randomBetween(flowerConfig.petalWidth.min, flowerConfig.petalWidth.max) * flowerScale;
    const petalHeight = randomBetween(flowerConfig.petalHeight.min, flowerConfig.petalHeight.max) * flowerScale;
    const petalCount = round(randomBetween(flowerConfig.petalCount.min, flowerConfig.petalCount.max));
    const stemColor = randomColor(flowerConfig.colorPalette);
    const centerColor = randomColor(flowerConfig.colorPalette);
    const petalColor = randomColor(flowerConfig.colorPalette);
    const stemBend = randomBetween(flowerConfig.stemBend.min, flowerConfig.stemBend.max);
    const centerX = random(width);
    const centerY = random(height);
    const leaves = generateLeaves(flowerConfig.leafSize.min, flowerConfig.leafSize.max, stemHeight);

    // Call to the revised drawFlower function
    drawFlower(centerX, centerY, stemHeight, petalWidth, petalHeight, stemColor, centerColor, petalColor, stemBend, petalCount, leaves);
  }
}

function drawFlower(centerX, centerY, stemHeight, petalWidth, petalHeight, stemColor, centerColor, petalColor, stemBend, petalDirection, leaves) {
  const petalCount = 10;

  // Flower stem with bend and leaves
  stroke(stemColor);
  strokeWeight(20);
  noFill();
  beginShape();
  vertex(centerX, height);
  quadraticVertex(centerX + stemBend * 100, centerY + stemHeight, centerX, centerY);
  endShape();

  // Draw leaves on the stem
  drawLeaves(centerX, centerY, leaves, stemBend);


  // Flower center
  fill(centerColor);
  noStroke();
  ellipse(centerX, centerY, 150, 150);

  // Flower petals
  fill(petalColor);
  for (let i = 0; i < petalCount; i++) {
    const angle = TWO_PI / petalCount * i + petalDirection;
    const x = centerX + cos(angle) * 150 / 2;
    const y = centerY + sin(angle) * 150 / 2;
    ellipse(x, y, petalWidth, petalHeight);
  }
}
function generateLeaves(minSize, maxSize, stemHeight) {
  let leaves = [];
  const numLeaves = round(random(1, 3)); // Each stem can have between 1 to 3 leaves
  for (let i = 0; i < numLeaves; i++) {
    const size = randomBetween(minSize, maxSize);
    leaves.push({
      position: random(0.5, 0.8) * stemHeight, // Adjusted to be proportional to stem height
      size: size,
      angle: random(TWO_PI)
    });
  }
  return leaves;
}


function drawLeaves(centerX, centerY, leaves, stemBend) {
  fill(colors.leaf);
  noStroke();
  leaves.forEach(leaf => {
    push(); // Start a new drawing state
    translate(centerX, centerY + leaf.position * 200); // Move to the position on the stem
    rotate(leaf.angle + stemBend); // Rotate by the leaf's angle and stem's bend
    ellipse(0, 0, leaf.size, leaf.size * 2); // Draw an elliptical leaf
    pop(); // Restore original state
  });
}

function randomColorValue() {
  return color(random(255), random(255), random(255));
}


document.addEventListener('DOMContentLoaded', function () {
  let controlPanelVisible = false;
  const controlPanel = document.getElementById('controlPanel');
  const toggleButton = document.getElementById('toggleButton');

  toggleButton.addEventListener('click', function () {
    controlPanelVisible = !controlPanelVisible;
    controlPanel.style.transform = controlPanelVisible ? 'translateX(0)' : 'translateX(-100%)';
  });
  document.getElementById('redrawButton').addEventListener('click', drawFlowers);

  // Grab references to the controls
  const numFlowersControl = document.getElementById('numFlowers');
  const flowerScaleControl = document.getElementById('flowerScale');
  const stemHeightControl = document.getElementById('stemHeight');
  const petalCountControl = document.getElementById('petalCount');
  const colorVariationControl = document.getElementById('colorVariation');

  // Event listeners for the controls
  numFlowersControl.addEventListener('input', function () {
    flowerConfig.numFlowers.max = this.value;
    drawFlowers(); // A function you need to define to redraw flowers based on new config
  });

  flowerScaleControl.addEventListener('input', function () {
    flowerConfig.flowerScale.max = this.value;
    drawFlowers();
  });

  stemHeightControl.addEventListener('input', function () {
    flowerConfig.stemHeight.max = this.value;
    drawFlowers();
  });

  petalCountControl.addEventListener('input', function () {
    flowerConfig.petalCount.max = this.value;
    drawFlowers();
  });

  colorVariationControl.addEventListener('change', function () {
    flowerConfig.colorPalette.variation = this.value;
    drawFlowers();
  });

  document.addEventListener('keydown', function (event) {
    // Check if the key is "r" for redraw
    if (event.key === 'r' || event.key === 'R') {
      drawFlowers();
    }
  });

  function drawFlowers() {
    clear(); // Clears the canvas
    background('#FFDAB9'); // Sets the background color again

    const numFlowers = round(randomBetween(
      flowerConfig.numFlowers.min,
      flowerConfig.numFlowers.max
    ));

    for (let i = 0; i < numFlowers; i++) {
      const flowerScale = randomBetween(
        flowerConfig.flowerScale.min,
        flowerConfig.flowerScale.max
      );
      const stemHeight = randomBetween(
        flowerConfig.stemHeight.min,
        flowerConfig.stemHeight.max
      ) * flowerScale;
      const petalWidth = randomBetween(
        flowerConfig.petalWidth.min,
        flowerConfig.petalWidth.max
      ) * flowerScale;
      const petalHeight = randomBetween(
        flowerConfig.petalHeight.min,
        flowerConfig.petalHeight.max
      ) * flowerScale;
      const petalCount = round(randomBetween(
        flowerConfig.petalCount.min,
        flowerConfig.petalCount.max
      ));
      const stemColor = randomLeaves ? randomColorValue() : colors.stem;
      const centerColor = randomLeaves ? randomColorValue() : colors.center;
      const petalColor = useRandomColors ? randomColor(flowerConfig.colorPalette) : colors.petal;
      const stemBend = randomBend ? randomBetween(flowerConfig.stemBend.min, flowerConfig.stemBend.max) : 0;
      const centerX = random(width);
      const centerY = random(height);
      const leaves = randomLeaves ? generateLeaves(flowerConfig.leafSize.min, flowerConfig.leafSize.max, stemHeight) : [];

      drawIndividualFlower(centerX, centerY, stemHeight, petalWidth, petalHeight, stemColor, centerColor, petalColor, stemBend, petalCount, leaves);
    }
  }
});
