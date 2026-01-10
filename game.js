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

// Game state
let gameOver = false;  // Flag to track if game is over
let frameCount = 0;  // Frame counter for pipe spawning
let score = 0;  // Player's current score

// Physics constants
const GRAVITY = 0.5;  // Acceleration due to gravity (pixels per frame squared)
const FLAP_STRENGTH = -8;  // Velocity applied when bird flaps (negative = upward)
const MAX_VELOCITY = 10;  // Maximum downward velocity (terminal velocity)

// Ground constant
const GROUND_HEIGHT = 80;  // Height of ground area at bottom of canvas (pixels)

// Pipe constants
const PIPE_WIDTH = 52;  // Width of each pipe in pixels
const PIPE_GAP = 120;  // Vertical gap between top and bottom pipes in pixels
const PIPE_SPEED = 2;  // Horizontal speed of pipes (pixels per frame)
const PIPE_SPAWN_INTERVAL = 90;  // Frames between spawning new pipes

// Pipes array to hold all active pipes
const pipes = [];

// Pipe object structure: {x, topHeight, bottomY}
// - x: horizontal position of the pipe (left edge)
// - topHeight: height of the top pipe section (from top of canvas)
// - bottomY: y position where the bottom pipe starts (topHeight + PIPE_GAP)

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
    gameOver = false;  // Reset game over flag
    frameCount = 0;  // Reset frame counter
    score = 0;  // Reset score
}

// Reset bird to initial state
function resetBird() {
    initBird();
}

// Collision detection function using AABB (Axis-Aligned Bounding Box) algorithm
// rect1 and rect2 are objects with {x, y, width, height} properties
// Returns true if rectangles overlap or touch, false otherwise
function checkCollision(rect1, rect2) {
    // Check if rectangles overlap using AABB collision detection
    // Two rectangles overlap if:
    // - rect1's left edge is to the left of or equal to rect2's right edge AND
    // - rect1's right edge is to the right of or equal to rect2's left edge AND
    // - rect1's top edge is above or equal to rect2's bottom edge AND
    // - rect1's bottom edge is below or equal to rect2's top edge
    // Using <= and >= allows touching edges to be considered collisions
    
    const rect1Right = rect1.x + rect1.width;
    const rect1Bottom = rect1.y + rect1.height;
    const rect2Right = rect2.x + rect2.width;
    const rect2Bottom = rect2.y + rect2.height;
    
    return (
        rect1.x <= rect2Right &&
        rect1Right >= rect2.x &&
        rect1.y <= rect2Bottom &&
        rect1Bottom >= rect2.y
    );
}

// Update bird physics (gravity and velocity)
function updateBird() {
    // Don't update bird if game is over
    if (gameOver) {
        return;
    }

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

    // Check for ceiling collision
    if (bird.y <= 0) {
        // Bird has hit the ceiling
        gameOver = true;
        // Position bird exactly at top of canvas
        bird.y = 0;
    }

    // Check for ground collision
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    const birdBottom = bird.y + bird.height;
    
    if (birdBottom >= groundY) {
        // Bird has hit the ground
        gameOver = true;
        // Position bird exactly on ground surface
        bird.y = groundY - bird.height;
    }
}

// Spawn a new pipe at the right edge of the canvas
function spawnPipe() {
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    // Generate random topHeight between 50 and (groundY - PIPE_GAP - 50)
    // This ensures there's always at least 50px space at top and bottom
    const minTopHeight = 50;
    const maxTopHeight = groundY - PIPE_GAP - 50;
    const topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight + 1)) + minTopHeight;
    
    // Calculate bottomY from topHeight + PIPE_GAP
    const bottomY = topHeight + PIPE_GAP;
    
    // Create new pipe object and add to pipes array
    const newPipe = {
        x: CANVAS_WIDTH,  // Start at right edge of canvas
        topHeight: topHeight,
        bottomY: bottomY,
        passed: false  // Track if bird has passed this pipe
    };
    
    pipes.push(newPipe);
}

// Check if bird collides with any pipe
function checkPipeCollisions() {
    // Don't check collisions if game is already over
    if (gameOver) {
        return;
    }

    // Create bird hitbox
    const birdHitbox = {
        x: bird.x,
        y: bird.y,
        width: bird.width,
        height: bird.height
    };

    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    // Loop through all pipes
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        // Create hitbox for top pipe section
        const topPipeHitbox = {
            x: pipe.x,
            y: 0,
            width: PIPE_WIDTH,
            height: pipe.topHeight
        };

        // Create hitbox for bottom pipe section
        const bottomPipeHitbox = {
            x: pipe.x,
            y: pipe.bottomY,
            width: PIPE_WIDTH,
            height: groundY - pipe.bottomY
        };

        // Check bird against top pipe
        if (checkCollision(birdHitbox, topPipeHitbox)) {
            gameOver = true;
            return;  // Exit early once collision is detected
        }

        // Check bird against bottom pipe
        if (checkCollision(birdHitbox, bottomPipeHitbox)) {
            gameOver = true;
            return;  // Exit early once collision is detected
        }
    }
}

// Update pipe positions (move pipes from right to left)
function updatePipes() {
    // Don't update pipes if game is over
    if (gameOver) {
        return;
    }

    // Move each pipe to the left by PIPE_SPEED
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= PIPE_SPEED;
    }
    
    // Detect when bird passes a pipe
    // Bird passes a pipe when bird's x position is greater than pipe's right edge (x + PIPE_WIDTH)
    // Only check pipes that haven't been passed yet (passed === false)
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        if (!pipe.passed && bird.x > pipe.x + PIPE_WIDTH) {
            pipe.passed = true;
        }
    }
    
    // Remove pipes that have moved completely off-screen to the left
    // A pipe is off-screen when its right edge (x + PIPE_WIDTH) is less than 0
    for (let i = pipes.length - 1; i >= 0; i--) {
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }
    
    // Spawn new pipe at regular intervals
    if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
        spawnPipe();
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

// Render pipes (top and bottom sections)
function renderPipes() {
    ctx.fillStyle = '#228B22';  // Green color for pipes
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    
    // Loop through all pipes in the array
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        
        // Draw top pipe section (from top of canvas to topHeight)
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        
        // Draw bottom pipe section (from bottomY to ground)
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, groundY - pipe.bottomY);
    }
}

// Render ground at bottom of canvas
function renderGround() {
    ctx.fillStyle = '#deb887';  // Tan/brown color
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    ctx.fillRect(0, groundY, CANVAS_WIDTH, GROUND_HEIGHT);
}

// Render score at top center of canvas
function renderScore() {
    ctx.fillStyle = '#ffffff';  // White color
    ctx.font = '48px sans-serif';  // Large font size for visibility
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'top';  // Align text from top
    ctx.fillText(score.toString(), CANVAS_WIDTH / 2, 20);  // Draw score at top center
}

// Update function - contains game logic
function update() {
    // Increment frame counter
    frameCount++;
    
    // Update bird physics (gravity and movement)
    updateBird();
    
    // Update pipe positions (move pipes from right to left)
    updatePipes();
    
    // Check for bird-pipe collisions
    checkPipeCollisions();
}

// Render function - draws all game elements
function render() {
    // Clear the canvas at the start of each frame
    clearCanvas();

    // Draw background
    drawBackground();

    // Draw game elements
    renderPipes();  // Draw pipes before bird so they appear behind
    renderBird();

    // Draw ground
    renderGround();

    // Draw score
    renderScore();
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
