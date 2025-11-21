// =========================
// Canvas Setup
// =========================
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// =========================
// Helpers
// =========================
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
    return `rgb(${random(50, 255)},${random(50, 255)},${random(50, 255)})`;
}

// =========================
// Base Shape
// =========================
class Shape {
    constructor(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
    }
}

// =========================
// Ball
// =========================
class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
        super(x, y, velX, velY);
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        // Bounce off left and right walls
        if (this.x + this.size >= width) {
            this.velX = -Math.abs(this.velX);
        }
        if (this.x - this.size <= 0) {
            this.velX = Math.abs(this.velX);
        }

        // Bounce off top
        if (this.y - this.size <= 0) {
            this.velY = Math.abs(this.velY);
        }

        this.x += this.velX;
        this.y += this.velY;
    }
}

// =========================
// Paddle (replaces EvilCircle)
// =========================
class Paddle extends Shape {
    constructor() {
        const paddleWidth = 120;
        const paddleHeight = 20;
        const startX = width / 2 - paddleWidth / 2;
        const startY = height - 40; // near bottom

        super(startX, startY, 10, 0); // velX = move speed, velY unused

        this.width = paddleWidth;
        this.height = paddleHeight;
        this.color = "white";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(inputState) {
        if (inputState.left) {
            this.x -= this.velX;
        }
        if (inputState.right) {
            this.x += this.velX;
        }

        // Keep paddle on screen
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > width) this.x = width - this.width;
    }
}

// =========================
// Brick
// =========================
class Brick {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = color;
        this.destroyed = false;
    }

    draw() {
        if (this.destroyed) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// =========================
// Game State
// =========================
let ball;
let paddle;
let bricks = [];
let level = 1;
let score = 0;
let lives = 3;
let gameOver = false;

const scoreDisplay = document.querySelector("p");

// input state for paddle movement
const inputState = {
    left: false,
    right: false,
};

// =========================
// Input Handling
// =========================
window.addEventListener("keydown", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") {
        inputState.left = true;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        inputState.right = true;
    }

    // Simple restart when game over
    if (gameOver && e.key === "Enter") {
        resetGame();
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "a" || e.key === "ArrowLeft") {
        inputState.left = false;
    }
    if (e.key === "d" || e.key === "ArrowRight") {
        inputState.right = false;
    }
});

// =========================
// Level / Game Setup
// =========================
function createBricksForLevel(levelNumber) {
    bricks = [];

    const rows = 3 + levelNumber - 1; // level 1 = 3 rows, level 2 = 4, etc
    const cols = 10;
    const padding = 10;
    const offsetTop = 60;
    const offsetLeft = 40;

    const totalPadding = padding * (cols - 1) + offsetLeft * 2;
    const brickWidth = (width - totalPadding) / cols;
    const brickHeight = 25;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetLeft + col * (brickWidth + padding);
            const y = offsetTop + row * (brickHeight + padding);
            bricks.push(new Brick(x, y, brickWidth, brickHeight, randomRGB()));
        }
    }
}

function resetBallAndPaddle() {
    const ballSpeed = 5 + level; // slightly faster each level
    ball = new Ball(
        width / 2,
        height - 80,
        ballSpeed * (Math.random() < 0.5 ? -1 : 1),
        -ballSpeed,
        "white",
        10
    );
    paddle = new Paddle();
}

function resetGame() {
    level = 1;
    score = 0;
    lives = 3;
    gameOver = false;
    createBricksForLevel(level);
    resetBallAndPaddle();
}

resetGame();

// =========================
// Collision Helpers
// =========================
function handlePaddleCollision() {
    // AABB vs circle simple check
    const withinX =
        ball.x + ball.size > paddle.x && ball.x - ball.size < paddle.x + paddle.width;
    const withinY =
        ball.y + ball.size > paddle.y && ball.y - ball.size < paddle.y + paddle.height;

    if (withinX && withinY && ball.velY > 0) {
        // bounce up
        ball.velY = -Math.abs(ball.velY);

        // tweak X velocity based on where ball hits paddle
        const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        ball.velX += hitPos * 2; // small horizontal "english"
    }
}

function handleBrickCollisions() {
    for (const brick of bricks) {
        if (brick.destroyed) continue;

        const withinX =
            ball.x + ball.size > brick.x &&
            ball.x - ball.size < brick.x + brick.width;
        const withinY =
            ball.y + ball.size > brick.y &&
            ball.y - ball.size < brick.y + brick.height;

        if (withinX && withinY) {
            brick.destroyed = true;
            score += 10;
            // Simple bounce: flip vertical velocity
            ball.velY = -ball.velY;
            break; // prevent multiple bricks in one frame
        }
    }

    // If all bricks destroyed, go to next level
    if (bricks.every((b) => b.destroyed)) {
        level++;
        createBricksForLevel(level);
        resetBallAndPaddle();
    }
}

// =========================
// Main Loop
// =========================
function updateHUD() {
    scoreDisplay.textContent = `Score: ${score}  Lives: ${lives}  Level: ${level}`;
}

function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(0, 0, width, height);

    if (!gameOver) {
        // Update objects
        paddle.update(inputState);
        ball.update();

        // Ball off bottom = lose life
        if (ball.y - ball.size > height) {
            lives--;
            if (lives <= 0) {
                gameOver = true;
            } else {
                resetBallAndPaddle();
            }
        }

        // Collisions
        handlePaddleCollision();
        handleBrickCollisions();

        // Draw bricks
        for (const brick of bricks) {
            brick.draw();
        }

        // Draw paddle and ball
        paddle.draw();
        ball.draw();
    } else {
        // Game over screen
        ctx.fillStyle = "white";
        ctx.font = "48px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", width / 2, height / 2 - 20);
        ctx.font = "24px sans-serif";
        ctx.fillText("Press Enter to Restart", width / 2, height / 2 + 20);
    }

    updateHUD();
    requestAnimationFrame(loop);
}

loop();
