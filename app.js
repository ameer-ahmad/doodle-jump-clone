// VARIABLES
const grid = document.querySelector(".grid");
const ball = document.createElement("div");
let ballLeftSpace = 50;
let startPoint = 150;
let ballBottomSpace = startPoint;
let isGameOver = false;
let platformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;

// PLATFORM CLASS
class Platform {
  constructor(newPlatBottom) {
    this.bottom = newPlatBottom;
    this.left = Math.random() * 315;
    this.visual = document.createElement("div");

    const visual = this.visual;
    visual.classList.add("platform");
    visual.style.left = `${this.left}px`;
    visual.style.bottom = `${this.bottom}px`;
    grid.appendChild(visual);
  }
}

// FUNCTIONS
const createBall = () => {
  grid.appendChild(ball);
  ball.classList.add("ball");
  ballLeftSpace = platforms[0].left;
  ball.style.left = `${ballLeftSpace}px`;
  ball.style.bottom = `${ballBottomSpace}px`;
};

const createPlatforms = () => {
  for (let i = 0; i < platformCount; i++) {
    let platGap = 600 / platformCount;
    let newPlatBottom = 100 + i * platGap;
    let newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
  }
};

const movePlatforms = () => {
  if (ballBottomSpace > 200) {
    platforms.forEach((platform) => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = `${platform.bottom}px`;

      if (platform.bottom < 10) {
        let firstPlatform = platforms[0].visual;
        firstPlatform.classList.remove("platform");
        platforms.shift();
        score++;
        let newPlatform = new Platform(600);
        platforms.push(newPlatform);
      }
    });
  }
};

const jump = () => {
  clearInterval(downTimerId);
  isJumping = true;
  upTimerId = setInterval(() => {
    ballBottomSpace += 20;
    ball.style.bottom = `${ballBottomSpace}px`;
    if (ballBottomSpace > startPoint + 200) {
      fall();
    }
  }, 30);
};

const fall = () => {
  clearInterval(upTimerId);
  isJumping = false;
  downTimerId = setInterval(() => {
    ballBottomSpace -= 5;
    ball.style.bottom = `${ballBottomSpace}px`;
    if (ballBottomSpace <= 0) {
      gameOver();
    }
    platforms.forEach((platform) => {
      if (
        ballBottomSpace >= platform.bottom &&
        ballBottomSpace <= platform.bottom + 15 &&
        ballLeftSpace + 60 >= platform.left &&
        ballLeftSpace <= platform.left + 85 &&
        !isJumping
      ) {
        startPoint = ballBottomSpace;
        jump();
      }
    });
  }, 30);
};

const moveLeft = () => {
  clearInterval(rightTimerId);
  isGoingRight = false;

  isGoingLeft = true;
  leftTimerId = setInterval(() => {
    if (ballLeftSpace >= 0) {
      ballLeftSpace -= 5;
      ball.style.left = `${ballLeftSpace}px`;
    } else {
      moveRight();
    }
  }, 30);
};

const moveStraight = () => {
  isGoingLeft = false;
  isGoingRight = false;
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
};

const moveRight = () => {
  clearInterval(leftTimerId);
  isGoingLeft = false;
  isGoingRight = true;
  rightTimerId = setInterval(() => {
    if (ballLeftSpace <= 340) {
      ballLeftSpace += 5;
      ball.style.left = `${ballLeftSpace}px`;
    } else {
      moveLeft();
    }
  }, 30);
};

const gameOver = () => {
  isGameOver = true;
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  grid.innerHTML = score;
  clearInterval(upTimerId);
  clearInterval(downTimerId);
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
};

const control = (e) => {
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowUp") {
    moveStraight();
  }
};

const start = () => {
  if (!isGameOver) {
    createPlatforms();
    createBall();
    movePlatforms();
    setInterval(movePlatforms, 30);
    jump();
    document.addEventListener("keydown", control);
  }
};

start();
