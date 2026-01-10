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

// Physics constants
const GRAVITY = 0.5;  // Acceleration due to gravity (pixels per frame squared)
const FLAP_STRENGTH = -8;  // Velocity applied when bird flaps (negative = upward)
const MAX_VELOCITY = 10;  // Maximum downward velocity (terminal velocity)

// Ground constant
const GROUND_HEIGHT = 80;  // Height of ground area at bottom of canvas (pixels)

// Game state
let gameOver = false;  // Flag to track if game is over

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
    gameOver = false;  // Reset game over state
}

// Reset bird to initial state
function resetBird() {
    initBird();
}

// Update bird physics (gravity and velocity)
function updateBird() {
    // Don't update bird if game is over
    if (gameOver) {
        return;
    }

    // Calculate ground y position (where ground starts)
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    // Apply gravity to velocity (accelerate downward)
    bird.velocity += GRAVITY;

    // Cap velocity to prevent falling too fast (terminal velocity)
    if (bird.velocity > MAX_VELOCITY) {
        bird.velocity = MAX_VELOCITY;
    }

    // Cap upward velocity to prevent flying too fast
    if (bird.velocity < FLAP_STRENGTH) {
        bird.velocity = FLAP_STRENGTH;
    }

    // Apply velocity to position (move the bird)
    bird.y += bird.velocity;

    // Check for ground collision (bird bottom edge >= ground y)
    const birdBottom = bird.y + bird.height;
    if (birdBottom >= groundY) {
        // Bird hit the ground
        gameOver = true;
        // Position bird so it visually rests on ground surface
        bird.y = groundY - bird.height;
        bird.velocity = 0;
    }
}

// Make bird flap (move upward)
function flap() {
    bird.velocity = FLAP_STRENGTH;
}

// Handle keyboard input
function handleKeyDown(event) {
    // Check if spacebar is pressed (keyCode 32 or code 'Space')
    if (event.code === 'Space' || event.keyCode === 32) {
        // Prevent default spacebar behavior (page scroll)
        event.preventDefault();
        // Make bird flap
        flap();
    }
}

// Handle mouse click on canvas
function handleClick(event) {
    // Make bird flap when canvas is clicked
    flap();
}

// Set up keyboard event listener
document.addEventListener('keydown', handleKeyDown);

// Set up mouse click event listener on canvas
canvas.addEventListener('click', handleClick);

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Draw background (sky blue)
function drawBackground() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Render bird as a yellow filled rectangle
function renderBird() {
    ctx.fillStyle = '#f7dc6f';  // Yellow color
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// Render ground at bottom of canvas
function renderGround() {
    ctx.fillStyle = '#deb887';  // Tan/brown color
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    ctx.fillRect(0, groundY, CANVAS_WIDTH, GROUND_HEIGHT);
}

// Update function - contains game logic
function update() {
    // Update bird physics (gravity and movement)
    updateBird();
}

// Render function - draws all game elements
function render() {
    // Clear the canvas at the start of each frame
    clearCanvas();

    // Draw background
    drawBackground();

    // Draw game elements
    renderBird();

    // Draw ground
    renderGround();
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
