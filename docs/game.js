let bgImage;
let scooterImage;
let bikeImage;
let rockImage;
let scooter;
let obstacles = [];
let gameState = 'start';
let startButton;
let restartButton;
let gameOverBanner;
let score = 0;

const ROAD_WIDTH = 200;  // Define the width of the road
const ROAD_CENTER = 380; // Center of the road (adjust accordingly)

function preload() {
  bgImage = loadImage('./assets/background.png');
  scooterImage = loadImage('./assets/scooter.png');
  rockImage = loadImage('./assets/rock.png');
  bikeImage = loadImage('./assets/bike.png');

}

function setup() {
  createCanvas(800, 400);
  scooter = new Scooter();

  // Create the start button
  startButton = createButton('Start Game');
  startButton.position(width / 2 - startButton.width / 2, height / 2);
  startButton.mousePressed(startGame); // Call startGame when the button is clicked

  // Create the restart button
  restartButton = createButton('Restart Game');
  restartButton.position(width / 2 - restartButton.width / 2, height / 2 + 50);
  restartButton.mousePressed(restartGame);
  restartButton.hide(); // Hide the button initially

  // Create the game over banner
  gameOverBanner = createDiv('Game Over');
  gameOverBanner.position(width / 2 - 50, height / 2 - 50);
  gameOverBanner.hide(); // Hide the banner initially
  gameOverBanner.style('background-color', 'white'); // Set the background color to white
  gameOverBanner.style('text-align', 'center'); // Center the text in the banner
}

function startGame() {
  gameState = 'play';
  startButton.hide();
}

function restartGame() {
  gameState = 'play';
  obstacles = []; // Clear the obstacles
  scooter = new Scooter(); // Create a new scooter
  restartButton.hide(); // Hide the restart button
  gameOverBanner.hide(); // Hide the game over banner
  score = 0; // Reset the score
  loop(); // Restart the draw loop
}

function draw() {
  if (gameState === 'play') {
    // Draw the background image
    image(bgImage, 0, 0, width, height);

    scooter.show();
    scooter.move();
    // Display the score
    fill(0); // Set the fill color to black
    rect(10, 10, 150, 40); // Draw a rectangle
  
    // Display the score
    fill(255); // Set the fill color to white
    textSize(24); // Set the text size
    text("Score: " + score, 20, 40); // Display the score

    // Randomly add obstacles
    if (random() < 0.02) {
      if (random() < 0.5) {
        obstacles.push(new Rock());
      } else {
        obstacles.push(new Bike());
      }
    }


    // Show and move obstacles
    for (let o of obstacles) {
      o.show();
      o.update();
    }
    for (let o of obstacles) {
      if (scooter.hits(o)) {
        noLoop(); // Stop the game
        gameState = 'over'; // Change the game state
        gameOverBanner.show(); // Show the game over banner
        restartButton.show(); // Show the restart button
        break;
      }
    }
    for (let i = obstacles.length - 1; i >= 0; i--) {
      let o = obstacles[i];

      // If the obstacle has moved off the screen
      if (o.y > height) {
        // Remove the obstacle from the array
        obstacles.splice(i, 1);

        // Increment the score
        score++;
      }
    }
  }
}

// Detect key presses to move the scooter
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    scooter.setDir(-1);
  } else if (keyCode === RIGHT_ARROW) {
    scooter.setDir(1);
  }
}

function keyReleased() {
  scooter.setDir(0);
}

class Scooter {
  constructor() {
    this.x = width / 2;
    this.y = height - 40;
    this.xspeed = 5;
    this.dir = 0;
    this.size = 20;
  }

  setDir(dir) {
    this.dir = dir;
  }

  move() {
    this.x += this.xspeed * this.dir;
    this.x = constrain(this.x, 0, width - 20);
  }

  show() {
    image(scooterImage, this.x, this.y, this.size, this.size);
  }

  hits(obstacle) {
    let d = dist(this.x + this.size / 2, this.y + this.size / 2, obstacle.x + obstacle.size / 2, obstacle.y + obstacle.size / 2);
    return (d < this.size / 2 + obstacle.size / 2);
  }
}

class Obstacle {
  constructor() {
    this.xStart = ROAD_CENTER; // Assuming the red dot is at the center of the road
    this.yStart = 75; // Top of the canvas

    this.x = this.xStart;
    this.y = this.yStart;

    // Random slope ensuring the obstacle remains within red lines
    this.slope = random(-0.25, 0.25); // Adjust these values as needed

    this.speed = 5;
    this.size = 1; // Start with a small size
    this.growthRate = 0.05; // Adjust this value as needed
  }

  update() {
    this.x += this.slope * this.speed;
    this.y += this.speed;
    this.size += this.growthRate;

    // Keep obstacle within the red lines (road boundaries)
    this.x = constrain(this.x, ROAD_CENTER - ROAD_WIDTH / 2, ROAD_CENTER + ROAD_WIDTH / 2 - this.size);
  }

  show() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Rock extends Obstacle {
  constructor() {
    super();
    this.size = 10; // Start with a smaller size for rock
    this.growthRate = 0.05; // Slower growth rate for rock
  }

  show() {
    image(rockImage, this.x, this.y, this.size, this.size);
  }
}

class Bike extends Obstacle {
  constructor() {
    super();
    this.size = 20; // Start with a bigger size for bike
    this.growthRate = 0.2; // Faster growth rate for bike
  }

  show() {
    image(bikeImage, this.x, this.y, this.size, this.size);
  }
}