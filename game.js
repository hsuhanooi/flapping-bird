// Flappy Bird - Game Logic

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Game loop state
let isGameLoopRunning = false;
let animationFrameId = null;

// Bird object
const bird = {
    x: 80,                          // Initial x position (left side of canvas)
    y: 300,                         // Initial y position (will be set to canvas height / 2)
    width: 34,                      // Bird width in pixels
    height: 24,                     // Bird height in pixels
    velocity: 0                     // Vertical velocity (positive = falling, negative = rising)
};

// Initialize bird position (set y to vertical center)
function initBird() {
    bird.x = 80;
    bird.y = CANVAS_HEIGHT / 2;
    bird.velocity = 0;
}

// Reset bird to initial state
function resetBird() {
    initBird();
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Draw background (sky blue)
function drawBackground() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Placeholder update function - will contain game logic
function update() {
    // Game logic will be added here in future features
}

// Placeholder render function - will draw game elements
function render() {
    // Clear the canvas at the start of each frame
    clearCanvas();

    // Draw background
    drawBackground();

    // Game elements will be rendered here in future features
}

// Main game loop using requestAnimationFrame
function gameLoop() {
    update();
    render();

    // Continue the loop
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Start the game loop
function startGameLoop() {
    if (!isGameLoopRunning) {
        isGameLoopRunning = true;
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Stop the game loop (useful for pausing or cleanup)
function stopGameLoop() {
    if (isGameLoopRunning) {
        isGameLoopRunning = false;
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }
}

// Initialize and start the game
function init() {
    initBird();
    startGameLoop();
}

// Run initialization when page loads
init();
