const canvas = document.getElementById('propeller-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const thrustBtn = document.getElementById('thrustBtn');

// Game States
let score = 0;
let gameState = 'START'; // Can be 'START', 'PLAYING', or 'GAMEOVER'
const gravity = 0.03; 
const lift = -2.25;

let drone = { x: 45, y: 100, width: 40, height: 30, velocity: 0 };
let obstacles = [];
const obstacleWidth = 60;
const gapHeight = 170;

function createObstacle() {
    let topHeight = Math.random() * (canvas.height - gapHeight - 100) + 50;
    obstacles.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - (topHeight + gapHeight),
        passed: false
    });
}

// State Controls
function handleThrust() {
    if (gameState === 'START' || gameState === 'GAMEOVER') {
        resetGame();
        gameState = 'PLAYING'; // Start physics at this point
        return;
    }
    drone.velocity = lift;
}

// Prevent spacebar from scrolling the page down
window.addEventListener('keydown', (e) => { 
    if (e.code === 'Space') {
        e.preventDefault(); 
        handleThrust(); 
    }
});
thrustBtn.addEventListener('mousedown', handleThrust);

function checkCollision(obs) {
    if (drone.x + drone.width > obs.x && drone.x < obs.x + obstacleWidth) {
        if (drone.y < obs.top || drone.y + drone.height > canvas.height - obs.bottom) {
            return true;
        }
    }
    return false;
}

// Game Loop
function gameLoop() {
    // clear the screen first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'START') {
        drawDrone();
        ctx.fillStyle = "white";
        ctx.font = "20px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("PRESS SPACE TO START", canvas.width/2, canvas.height/2);
        requestAnimationFrame(gameLoop);
        return;
    }

    if (gameState === 'GAMEOVER') {
        drawDrone(); 
        drawObstacles();
        ctx.fillStyle = "#ff00ff"; // text for crash
        ctx.font = "20px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.fillText("CRASHED! PRESS SPACE TO RESTART", canvas.width/2, canvas.height/2);
        requestAnimationFrame(gameLoop);
        return;
    }

    // --- PLAY STATE ---
    drone.velocity += gravity;
    drone.y += drone.velocity;

    // Floor/Ceiling collision
    if (drone.y < 0 || drone.y + drone.height > canvas.height) {
        gameState = 'GAMEOVER';
    }

    drawDrone();

    // Spawn new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 250) {
        createObstacle();
    }

    // Move obstacles and check collisions
    // IMPORTANT: reverse loopto delete obstacles that go off screen
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= 2.25; // Game speed

        // Add to Score
        if (!obs.passed && obs.x + obstacleWidth < drone.x) {
            score++;
            obs.passed = true;
            scoreDisplay.innerText = score.toString().padStart(4, '0');
        }

        // if hitting wall
        if (checkCollision(obs)) {
            gameState = 'GAMEOVER';
        }

        // Remove obstacles that have left the screen
        if (obs.x + obstacleWidth < 0) {
            obstacles.splice(i, 1);
        }
    }

    drawObstacles();
    requestAnimationFrame(gameLoop);
}

function drawDrone() {
    ctx.fillStyle = "#00ffff";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00ffff";
    ctx.fillRect(drone.x, drone.y, drone.width, drone.height);
    ctx.shadowBlur = 0; // Resets shadow so pipes don't glow
}

function drawObstacles() {
    ctx.fillStyle = "#333";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, 0, obstacleWidth, obs.top);
        ctx.fillRect(obs.x, canvas.height - obs.bottom, obstacleWidth, obs.bottom);
    });
}

function resetGame() {
    drone.y = 200;
    drone.velocity = 0;
    obstacles = [];
    score = 0;
    scoreDisplay.innerText = "0000";
}

// Start game Loop
gameLoop();