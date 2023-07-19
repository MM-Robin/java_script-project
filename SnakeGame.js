/* global THREE */
let gridPostions = [];
let leftShift = 0;
let topShift = 0;
let interval = 0;
let foodPosition = 0;
let snakeCurrentPosition = 0;
let positionShifter = 0;
let currentDirection = null;

let snake = null;
let food = null;

const foodSize = 0.047;
const topPosition = 0.048;
const minPosition = 0;
const maxPosition = 99;
const snakeSize = 0.09;
const snakeForwardingTimeInMs = 250;
const gridSize = 1;
const gridDivisions = 10;
const radius = 7;
const angularFrquency = Math.PI;

/**
 * Common functions for this game
 * used for snake food
 * used for snake start position
 */

// Return a random number
const getRandomNumber = () => {
  return Math.floor(Math.random() * (maxPosition - minPosition)) + minPosition;
};

fillGridPositions = () => {
  let index = 0;

  for (let row = -45; row <= 45; row += 10) {
    for (let col = 45; col >= -45; col -= 10) {
      gridPostions.push({
        x: row,
        y: col,
      });
      index++;
    }
  }
};

function toGridPosition(position) {
  return position / 100;
}

setFoodAtRandomPosition = () => {
  foodPosition = getRandomNumber();

  for (let i = 0; i < snake.size(); i++) {
    let snakeAtCell = snake.getByIndex(i);

    if (
      getGridPositionByAxes(
        snakeAtCell.position.x * 100,
        snakeAtCell.position.y * 100
      ) == foodPosition
    ) {
      setFoodAtRandomPosition();
    }
  }

  food.position.x = toGridPosition(gridPostions[foodPosition].x);
  food.position.y = toGridPosition(gridPostions[foodPosition].y);
  food.position.z = topPosition;
};

getGridPositionByAxes = (x, y) => {
  for (let i = 0; i <= 99; i++) {
    if (
      gridPostions[i].x == Math.round(x) &&
      gridPostions[i].y == Math.round(y)
    ) {
      return i;
    }
  }
  return -1; // No match and this grid does not exists
};

// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor("rgb(255,255,255)");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  5,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.set(0, -7, 18);
scene.add(camera);

camera.lookAt(scene.position);

// Global audio source
const audioListener = new THREE.AudioListener();
scene.add(audioListener);
const audio = new THREE.Audio(audioListener);
const audioLoader = new THREE.AudioLoader();

// Fill grid array with values
fillGridPositions();

// Add gaming field
const fieldGeometry = new THREE.PlaneGeometry(1, 1);
const fieldMaterial = new THREE.MeshBasicMaterial({
  color: 0xd3d3d3,
  side: THREE.DoubleSide,
});
const field = new THREE.Mesh(fieldGeometry, fieldMaterial);

const centerLineColor = new THREE.Color(0x444444);

const gridColor = new THREE.Color(0x000000);

const gridHelper = new THREE.GridHelper(
  gridSize,
  gridDivisions,
  centerLineColor,
  gridColor
);
gridHelper.rotation.x = Math.PI / 2; // 90 degree rotation
gridHelper.position.z = 0.001;
field.add(gridHelper);
scene.add(field);

// Add snake to the scene
const snakeGeo = new THREE.BoxGeometry(snakeSize, snakeSize, snakeSize);

const snakeMat = new THREE.MeshBasicMaterial({ color: "green" });
const snakeCell = new THREE.Mesh(snakeGeo, snakeMat);

snakeCurrentPosition = getRandomNumber(); // set a random position for the snake

const snakeRandomPosition = gridPostions[snakeCurrentPosition];

snakeCell.position.set(
  toGridPosition(snakeRandomPosition.x),
  toGridPosition(snakeRandomPosition.y),
  topPosition
);
snakeCell.scale.set(1.015, 1.015, 1.015);
field.add(snakeCell);

snake = new Deque();
snake.insertFront(snakeCell);

// Add food at a random place
const foodGeo = new THREE.SphereGeometry(1, 32, 16);
const foodMat = new THREE.MeshBasicMaterial({
  color: "red",
  side: THREE.DoubleSide,
});
food = new THREE.Mesh(foodGeo, foodMat);
food.scale.set(foodSize, foodSize, foodSize);

setFoodAtRandomPosition();
field.add(food);

const attachTailToSnack = () => {
  const newMat = new THREE.MeshBasicMaterial({ color: "blue" });

  const newTail = new THREE.Mesh(snakeGeo, newMat);
  newTail.position.z = topPosition - 0.00002;
  newTail.material = new THREE.MeshBasicMaterial({ color: "blue" });
  newTail.position.x += leftShift / 100;
  newTail.position.y += topShift / 100;

  field.add(newTail);
  snake.insertBack(newTail);
};

const moveSnakeTowardsDirection = () => {
  //movement of the snake
  let tempCell = null;
  let currentCell = snake.getFront();
  let prevCell = currentCell.clone();
  currentCell.position.x += toGridPosition(leftShift);
  currentCell.position.y += toGridPosition(topShift);

  for (let i = 0; i < snake.size() - 1; i++) {
    currentCell = snake.getByIndex(i + 1);
    tempCell = currentCell.clone();
    currentCell.position.x = prevCell.position.x;
    currentCell.position.y = prevCell.position.y;
    prevCell = tempCell;
  }
};

// * Gaming Controlls

window.onkeyup = (e) => {
  e.preventDefault();

  if (currentDirection == null) init();
  if (currentDirection == e.code) return;

  switch (e.code) {
    case "ArrowUp":
      if (currentDirection == "ArrowDown") return;
      leftShift = 0;
      topShift = 10;
      positionShifter = -1;
      break;
    case "ArrowLeft":
      if (currentDirection == "ArrowRight") return;
      leftShift = -10;
      topShift = 0;
      positionShifter = -10;
      break;
    case "ArrowRight":
      if (currentDirection == "ArrowLeft") return;
      leftShift = 10;
      topShift = 0;
      positionShifter = 10;
      break;
    case "ArrowDown":
      if (currentDirection == "ArrowUp") return;
      leftShift = 0;
      topShift = -10;
      positionShifter = 1;
      break;
  }
  currentDirection = e.code;
};

const endGame = () => {
  clearInterval(interval);
  // Play audio
  audioLoader.load("sound1.wav", function (buffer) {
    audio.setBuffer(buffer);
    audio.setLoop(false);
    audio.setVolume(0.5);
    audio.play();
  });

  document.getElementById("score-board").innerHTML =
    generateScoreBoardFinalHtml(snake.size() - 1);
};

const generateCurrentScoreBoardHtml = (score) => {
  return (
    "<span id='score'>Your current score is: <span id='score-value'>" +
    score +
    "</span></span>"
  );
};

const generateScoreBoardFinalHtml = (score) => {
  return (
    "<span id='score'>Game Over!<br>Your total score is: <span id='score-value'>" +
    score +
    "</span></span>"
  );
};

const isGameOver = () => {
  if (
    //When the Position of the snake is outside the board
    snake.getFront().position.x < -0.46 ||
    snake.getFront().position.x > 0.46 ||
    snake.getFront().position.y < -0.46 ||
    snake.getFront().position.y > 0.46
  ) {
    endGame();
    return true;
  }

  for (let i = 1; i < snake.size(); i++) {
    let cell = snake.getByIndex(i);
    if (
      getGridPositionByAxes(cell.position.x * 100, cell.position.y * 100) ==
      snakeCurrentPosition
    ) {
      endGame();
      return true;
    }
  }
};

// Game initialisation
function init() {
  interval = setInterval(() => {
    if (isGameOver()) return;

    snakeCurrentPosition += positionShifter;

    // If snake eats food
    if (snakeCurrentPosition == foodPosition) {
      // Play audio
      audioLoader.load("sound2.wav", function (buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(false);
        audio.setVolume(0.5);
        audio.play();
      });

      document.getElementById("score-board").innerHTML =
        generateCurrentScoreBoardHtml(snake.size());
      attachTailToSnack();
      setFoodAtRandomPosition();
    }

    // Move snake towards its current course
    moveSnakeTowardsDirection();
  }, snakeForwardingTimeInMs);
}

// * Render loop
const controls = new THREE.TrackballControls(camera, renderer.domElement);
const clock = new THREE.Clock();

function render(ms) {
  requestAnimationFrame(render);
  let time = ms / 1000;
  camera.position.x = 0 + radius * Math.cos(angularFrquency * time);
  camera.position.y = -7 + radius * Math.sin(angularFrquency * time);
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
  controls.update();
}
render();

// Added getByIndex function to get specific element by index
// * Deque: https://learnersbucket.com/tutorials/data-structures/implement-deque-data-structure-in-javascript/

function Deque() {
  //To track the elements from back
  let count = 0;

  //To track the elements from the front
  let lowestCount = 0;

  //To store the data
  let items = {};
  this.getValues = () => {
    return Object.values(items);
  };

  //Add an item on the front
  this.insertFront = (elm) => {
    if (this.isEmpty()) {
      //If empty then add on the back
      this.insertBack(elm);
    } else if (lowestCount > 0) {
      //Else if there is item on the back
      //then add to its front
      items[--lowestCount] = elm;
    } else {
      //Else shift the existing items
      //and add the new to the front
      for (let i = count; i > 0; i--) {
        items[i] = items[i - 1];
      }

      count++;
      items[0] = elm;
    }
  };

  //Add an item on the back of the list
  this.insertBack = (elm) => {
    items[count++] = elm;
  };

  //Remove the item from the front
  this.removeFront = () => {
    //if empty return null
    if (this.isEmpty()) {
      return null;
    }

    //Get the first item and return it
    const result = items[lowestCount];
    delete items[lowestCount];
    lowestCount++;
    return result;
  };

  //Remove the item from the back
  this.removeBack = () => {
    //if empty return null
    if (this.isEmpty()) {
      return null;
    }

    //Get the last item and return it
    count--;
    const result = items[count];
    delete items[count];
    return result;
  };

  //Peek the first element
  this.getFront = () => {
    //If empty then return null
    if (this.isEmpty()) {
      return null;
    }

    //Return first element
    return items[lowestCount];
  };

  //Peek the last element
  this.getBack = () => {
    //If empty then return null
    if (this.isEmpty()) {
      return null;
    }

    //Return first element
    return items[count - 1];
  };

  //Check if empty
  this.isEmpty = () => {
    return this.size() === 0;
  };

  //Get the size
  this.size = () => {
    return count - lowestCount;
  };

  //Clear the deque
  this.clear = () => {
    count = 0;
    lowestCount = 0;
    items = {};
  };

  //Convert to the string
  //From front to back
  this.toString = () => {
    if (this.isEmpty()) {
      return "";
    }
    let objString = `${items[lowestCount]}`;
    for (let i = lowestCount + 1; i < count; i++) {
      objString = `${objString},${items[i]}`;
    }
    return objString;
  };

  // Get elm by given by the provided index
  this.getByIndex = (index) => {
    if (this.isEmpty()) {
      return null;
    }
    return items[index];
  };
}
