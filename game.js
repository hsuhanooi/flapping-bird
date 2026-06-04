// Flappy Bird - Game Logic

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Theme support (e.g. ?theme=sky for a travel-focused skin)
let THEME = 'default';
try {
    THEME = new URLSearchParams(window.location.search).get('theme') || 'default';
} catch (e) {
    THEME = 'default';
}
const isSkyTheme = THEME === 'sky';

// Game loop state
let isGameLoopRunning = false;
let animationFrameId = null;

// Game state
let gameOver = false;  // Flag to track if game is over
let frameCount = 0;  // Frame counter for pipe spawning
let score = 0;  // Player's current score
let highScore = 0;  // Player's highest score (persisted in localStorage)

// Game state machine
// States: 'start', 'playing', 'gameover'
let gameState = 'start';  // Initial state is 'start'

// Helper functions to check current game state
function isPlaying() {
    return gameState === 'playing';
}

function isGameOver() {
    return gameState === 'gameover';
}

function isStart() {
    return gameState === 'start';
}

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
// Sky theme: buildings sit flush against each other (no horizontal gap).
// Spacing between obstacles = PIPE_SPEED * interval, so PIPE_WIDTH / PIPE_SPEED
// makes each building's right edge meet the next building's left edge exactly.
const SKY_BUILDING_INTERVAL = PIPE_WIDTH / PIPE_SPEED;  // 26 frames

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

// Reset all game variables for a new game
function resetGame() {
    // Reset bird position to initial values
    bird.x = 80;
    bird.y = CANVAS_HEIGHT / 2;

    // Reset bird velocity to 0
    bird.velocity = 0;

    // Clear pipes array
    pipes.length = 0;

    // Reset score to 0
    score = 0;

    // Reset frameCount to 0
    frameCount = 0;

    // Reset gameOver flag
    gameOver = false;
}

// Load high score from localStorage
function loadHighScore() {
    // Retrieve high score from localStorage
    const storedHighScore = localStorage.getItem('flappyHighScore');

    // If a value exists, parse it as an integer
    if (storedHighScore !== null) {
        const parsedScore = parseInt(storedHighScore, 10);
        // Ensure parsed value is a valid number, default to 0 if not
        highScore = isNaN(parsedScore) ? 0 : parsedScore;
    } else {
        // Default to 0 if no stored value exists
        highScore = 0;
    }
}

// Save high score to localStorage
function saveHighScore() {
    // Compare current score with highScore
    if (score > highScore) {
        // Update highScore variable
        highScore = score;
        // Save to localStorage
        localStorage.setItem('flappyHighScore', highScore.toString());
    }
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
    // Don't update bird if game is over or not playing
    if (gameOver || !isPlaying()) {
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
        gameState = 'gameover';  // Set game state to gameover
        saveHighScore();  // Save high score on game over
        // Position bird exactly at top of canvas
        bird.y = 0;
    }

    // Check for ground collision
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    const birdBottom = bird.y + bird.height;
    
    if (birdBottom >= groundY) {
        // Bird has hit the ground
        gameOver = true;
        gameState = 'gameover';  // Set game state to gameover
        saveHighScore();  // Save high score on game over
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
    let topHeight = Math.floor(Math.random() * (maxTopHeight - minTopHeight + 1)) + minTopHeight;

    // Sky theme: buildings are flush, so a fully random gap height would make
    // the skyline impossible to thread. Nudge each gap only a little from the
    // previous building's gap to keep a continuous, navigable cityscape.
    if (isSkyTheme && pipes.length > 0) {
        const prevTop = pipes[pipes.length - 1].topHeight;
        const maxStep = 26;  // max vertical change between adjacent buildings
        const delta = Math.max(-maxStep, Math.min(maxStep, topHeight - prevTop));
        topHeight = Math.max(minTopHeight, Math.min(maxTopHeight, prevTop + delta));
    }

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
            gameState = 'gameover';  // Set game state to gameover
            saveHighScore();  // Save high score on game over
            return;  // Exit early once collision is detected
        }

        // Check bird against bottom pipe
        if (checkCollision(birdHitbox, bottomPipeHitbox)) {
            gameOver = true;
            gameState = 'gameover';  // Set game state to gameover
            saveHighScore();  // Save high score on game over
            return;  // Exit early once collision is detected
        }
    }
}

// Update pipe positions (move pipes from right to left)
function updatePipes() {
    // Don't update pipes if game is over or not playing
    if (gameOver || !isPlaying()) {
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
            // Increment score when bird passes a pipe
            score++;
        }
    }
    
    // Remove pipes that have moved completely off-screen to the left
    // A pipe is off-screen when its right edge (x + PIPE_WIDTH) is less than 0
    for (let i = pipes.length - 1; i >= 0; i--) {
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }
    
    // Spawn new pipe at regular intervals.
    // Sky theme spawns buildings flush side-by-side at a much tighter cadence.
    if ((!isSkyTheme && frameCount % PIPE_SPAWN_INTERVAL === 0) ||
        (isSkyTheme && frameCount % SKY_BUILDING_INTERVAL === 0)) {
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

        // If in start state, transition to playing state
        if (isStart()) {
            gameState = 'playing';
            flap();  // Trigger first flap on game start
            return;
        }

        // If in gameover state, restart the game
        if (isGameOver()) {
            resetGame();
            gameState = 'playing';
            flap();  // Trigger first flap on restart
            return;
        }

        // If in playing state, make bird flap
        if (isPlaying()) {
            flap();
        }
    }
}

// Handle mouse click on canvas
function handleClick(event) {
    // If in start state, transition to playing state
    if (isStart()) {
        gameState = 'playing';
        flap();  // Trigger first flap on game start
        return;
    }

    // If in gameover state, restart the game
    if (isGameOver()) {
        resetGame();
        gameState = 'playing';
        flap();  // Trigger first flap on restart
        return;
    }

    // If in playing state, make bird flap
    if (isPlaying()) {
        flap();
    }
}

// Handle touch input on canvas
function handleTouch(event) {
    // Prevent default touch behavior (scrolling, zooming, etc.)
    event.preventDefault();

    // Reuse same flap logic as click handler
    // If in start state, transition to playing state
    if (isStart()) {
        gameState = 'playing';
        flap();  // Trigger first flap on game start
        return;
    }

    // If in gameover state, restart the game
    if (isGameOver()) {
        resetGame();
        gameState = 'playing';
        flap();  // Trigger first flap on restart
        return;
    }

    // If in playing state, make bird flap
    if (isPlaying()) {
        flap();
    }
}

// Set up keyboard event listener
document.addEventListener('keydown', handleKeyDown);

// Set up mouse click event listener on canvas
canvas.addEventListener('click', handleClick);

// Set up touch event listener on canvas
canvas.addEventListener('touchstart', handleTouch);

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Draw the travel-themed background (mountains, city skyline, lake, evergreens)
// Inspired by a dusk view of a coastal mountain city.
function drawSkyBackground() {
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    const horizonY = 300;       // where mountains/skyline meet the sky
    const waterY = 380;         // top of the lake

    // ===== SKY GRADIENT (deep dusk blue fading to warm horizon) =====
    const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, '#16273f');    // deep dusk blue at top
    sky.addColorStop(0.55, '#274a6e');
    sky.addColorStop(0.85, '#7a7e8f');
    sky.addColorStop(1, '#e3a877');    // warm sunset glow at horizon
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, CANVAS_WIDTH, horizonY);

    // Warm sunset band hugging the horizon
    const glow = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 20);
    glow.addColorStop(0, 'rgba(240,170,110,0)');
    glow.addColorStop(1, 'rgba(245,190,130,0.65)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, horizonY - 40, CANVAS_WIDTH, 60);

    // ===== FAR MOUNTAIN RANGE (hazy blue) =====
    ctx.fillStyle = '#3f5872';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(0, 250);
    ctx.lineTo(70, 215);
    ctx.lineTo(150, 245);
    ctx.lineTo(240, 200);
    ctx.lineTo(330, 240);
    ctx.lineTo(400, 220);
    ctx.lineTo(400, horizonY);
    ctx.closePath();
    ctx.fill();

    // ===== MAIN MOUNTAIN MASSIF (darker, with snow caps) =====
    const peaks = [
        [0, horizonY], [0, 240], [55, 250], [110, 205],
        [165, 150], [210, 185], [260, 160], [320, 205],
        [365, 185], [400, 215], [400, horizonY]
    ];
    ctx.fillStyle = '#22384a';
    ctx.beginPath();
    ctx.moveTo(peaks[0][0], peaks[0][1]);
    for (let i = 1; i < peaks.length; i++) {
        ctx.lineTo(peaks[i][0], peaks[i][1]);
    }
    ctx.closePath();
    ctx.fill();

    // Snow caps on the tallest summits
    ctx.fillStyle = '#dbe9f2';
    ctx.beginPath();
    ctx.moveTo(165, 150);
    ctx.lineTo(150, 178);
    ctx.lineTo(178, 172);
    ctx.lineTo(188, 182);
    ctx.lineTo(200, 174);
    ctx.lineTo(210, 185);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(260, 160);
    ctx.lineTo(248, 186);
    ctx.lineTo(272, 180);
    ctx.lineTo(282, 192);
    ctx.lineTo(295, 185);
    ctx.closePath();
    ctx.fill();

    // Forested lower slopes (deep green) sitting in front of the rock
    ctx.fillStyle = '#1c3327';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(0, 282);
    ctx.lineTo(80, 268);
    ctx.lineTo(170, 278);
    ctx.lineTo(250, 262);
    ctx.lineTo(340, 280);
    ctx.lineTo(400, 270);
    ctx.lineTo(400, horizonY);
    ctx.closePath();
    ctx.fill();

    // ===== CITY SKYLINE (silhouetted buildings with a few lit windows) =====
    const buildings = [
        [120, 348, 22], [144, 338, 18], [164, 356, 16], [182, 330, 20],
        [204, 350, 24], [230, 360, 18], [250, 326, 22], [274, 352, 20],
        [296, 312, 26], [324, 344, 20], [346, 356, 18], [366, 334, 22]
    ];
    for (let i = 0; i < buildings.length; i++) {
        const [bx, by, bw] = buildings[i];
        ctx.fillStyle = i % 2 === 0 ? '#564f5b' : '#48434f';
        ctx.fillRect(bx, by, bw, waterY - by);
        // Lit windows (warm dusk light)
        ctx.fillStyle = 'rgba(240,170,95,0.85)';
        for (let wy = by + 6; wy < waterY - 4; wy += 8) {
            for (let wx = bx + 3; wx < bx + bw - 3; wx += 7) {
                if ((wx + wy + i) % 3 === 0) {
                    ctx.fillRect(wx, wy, 2, 3);
                }
            }
        }
    }

    // ===== LAKE =====
    const water = ctx.createLinearGradient(0, waterY, 0, groundY);
    water.addColorStop(0, '#3a5e7e');
    water.addColorStop(1, '#26405a');
    ctx.fillStyle = water;
    ctx.fillRect(0, waterY, CANVAS_WIDTH, groundY - waterY);

    // City light reflections shimmering on the water
    ctx.fillStyle = 'rgba(240,170,95,0.25)';
    for (let i = 0; i < buildings.length; i += 2) {
        const [bx, , bw] = buildings[i];
        ctx.fillRect(bx + 2, waterY, Math.max(2, bw - 6), 26);
    }

    // ===== FOREGROUND EVERGREENS (silhouettes along the shore) =====
    function drawTree(tx, ty, h) {
        const w = h * 0.5;
        ctx.fillStyle = '#13241a';
        ctx.beginPath();
        ctx.moveTo(tx, ty - h);
        ctx.lineTo(tx - w / 2, ty - h * 0.45);
        ctx.lineTo(tx - w * 0.32, ty - h * 0.45);
        ctx.lineTo(tx - w * 0.6, ty);
        ctx.lineTo(tx + w * 0.6, ty);
        ctx.lineTo(tx + w * 0.32, ty - h * 0.45);
        ctx.lineTo(tx + w / 2, ty - h * 0.45);
        ctx.closePath();
        ctx.fill();
    }
    drawTree(40, groundY + 6, 70);
    drawTree(90, groundY + 10, 50);
    drawTree(330, groundY + 8, 60);
    drawTree(372, groundY + 12, 78);
    drawTree(300, groundY + 14, 44);
}

// Draw background (sky gradient - light blue at top, slightly darker at bottom)
function drawBackground() {
    // Travel-themed skin: render the scenic dusk landscape instead of the flat sky
    if (isSkyTheme) {
        drawSkyBackground();
        return;
    }

    // Create linear gradient from top to bottom
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    
    // Light blue at top (#87ceeb - sky blue)
    gradient.addColorStop(0, '#87ceeb');
    
    // Slightly darker blue at bottom (#70c5ce - original sky blue)
    gradient.addColorStop(1, '#70c5ce');
    
    // Apply gradient as fill style
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Render the bird as a fluffy cloud (travel/sky theme)
function renderCloudBird() {
    const cx = bird.x + bird.width / 2;
    const cy = bird.y + bird.height / 2;
    const w = bird.width;
    const h = bird.height;

    // Puff layout (offsets relative to cloud center, radius)
    const puffs = [
        [-w * 0.34, h * 0.12, h * 0.40],
        [-w * 0.04, -h * 0.20, h * 0.50],
        [w * 0.28, -h * 0.02, h * 0.44],
        [w * 0.14, h * 0.26, h * 0.36],
        [-w * 0.20, h * 0.30, h * 0.34]
    ];

    function tracePuffs(scale, dy) {
        ctx.beginPath();
        for (let i = 0; i < puffs.length; i++) {
            const [px, py, pr] = puffs[i];
            ctx.moveTo(cx + px + pr * scale, cy + py + dy);
            ctx.arc(cx + px, cy + py + dy, pr * scale, 0, Math.PI * 2);
        }
    }

    ctx.save();

    // Soft drop shadow / underside shading (slightly larger, offset down)
    tracePuffs(1.05, h * 0.18);
    ctx.fillStyle = '#b9cad9';
    ctx.fill();

    // Main cloud body (bright white on top)
    tracePuffs(1.0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Subtle highlight on the upper-left puffs
    ctx.beginPath();
    ctx.arc(cx - w * 0.04, cy - h * 0.28, h * 0.30, 0, Math.PI * 2);
    ctx.fillStyle = '#f4f9ff';
    ctx.fill();

    ctx.restore();
}

// Render bird with improved visual design (rounded body with eye)
function renderBird() {
    // Travel-themed skin: the "bird" is a drifting cloud
    if (isSkyTheme) return renderCloudBird();

    // Calculate rotation angle from bird velocity
    // Map velocity range (FLAP_STRENGTH to MAX_VELOCITY) to angle range (-30 to 90 degrees)
    // FLAP_STRENGTH (-8) maps to -30 degrees (tilted up)
    // MAX_VELOCITY (10) maps to 90 degrees (tilted down)
    const minVelocity = FLAP_STRENGTH;  // -8
    const maxVelocity = MAX_VELOCITY;   // 10
    const minAngle = -30;  // degrees (tilted up)
    const maxAngle = 90;   // degrees (tilted down)

    // Clamp velocity to range [minVelocity, maxVelocity]
    const clampedVelocity = Math.max(minVelocity, Math.min(maxVelocity, bird.velocity));

    // Map velocity to angle using linear interpolation
    // angle = minAngle + (velocity - minVelocity) * (maxAngle - minAngle) / (maxVelocity - minVelocity)
    const velocityRange = maxVelocity - minVelocity;  // 10 - (-8) = 18
    const angleRange = maxAngle - minAngle;  // 90 - (-30) = 120
    const normalizedVelocity = clampedVelocity - minVelocity;  // 0 to 18
    const rotationAngle = minAngle + (normalizedVelocity / velocityRange) * angleRange;

    // Convert angle from degrees to radians for ctx.rotate()
    const rotationRadians = (rotationAngle * Math.PI) / 180;

    // Save the current canvas state
    ctx.save();

    // Translate to bird center (x + width/2, y + height/2)
    const birdCenterX = bird.x + bird.width / 2;
    const birdCenterY = bird.y + bird.height / 2;
    ctx.translate(birdCenterX, birdCenterY);

    // Rotate around bird center
    ctx.rotate(rotationRadians);

    // Bird body dimensions (ellipse/rounded shape)
    const bodyRadiusX = bird.width / 2;  // 17px horizontal radius
    const bodyRadiusY = bird.height / 2;  // 12px vertical radius

    // Draw bird body as an ellipse with yellow/orange fill
    ctx.beginPath();
    ctx.ellipse(0, 0, bodyRadiusX, bodyRadiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f7dc6f';  // Yellow/gold color for body
    ctx.fill();

    // Add darker outline/stroke
    ctx.strokeStyle = '#d4ac0d';  // Darker gold/orange outline
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw eye (simple white circle with black pupil)
    // Position eye slightly to the right and up from center
    const eyeX = bodyRadiusX * 0.3;  // ~5px right of center
    const eyeY = -bodyRadiusY * 0.2;  // ~2px above center
    const eyeRadius = 5;

    // Eye white
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';  // White
    ctx.fill();
    ctx.strokeStyle = '#333333';  // Dark outline
    ctx.lineWidth = 1;
    ctx.stroke();

    // Eye pupil (black dot)
    const pupilX = eyeX + 1;  // Slightly to the right (looking forward)
    const pupilY = eyeY;
    const pupilRadius = 2;

    ctx.beginPath();
    ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';  // Black
    ctx.fill();

    // Draw beak (small orange triangle on the right side)
    const beakStartX = bodyRadiusX * 0.7;  // Start from right side of body
    const beakEndX = bodyRadiusX + 6;  // Extend past body
    const beakY = bodyRadiusY * 0.2;  // Slightly below center
    const beakHeight = 4;

    ctx.beginPath();
    ctx.moveTo(beakStartX, beakY - beakHeight);  // Top of beak
    ctx.lineTo(beakEndX, beakY);  // Tip of beak
    ctx.lineTo(beakStartX, beakY + beakHeight);  // Bottom of beak
    ctx.closePath();
    ctx.fillStyle = '#ff6b35';  // Orange color for beak
    ctx.fill();
    ctx.strokeStyle = '#cc5500';  // Darker orange outline
    ctx.lineWidth = 1;
    ctx.stroke();

    // Restore the canvas state
    ctx.restore();
}

// Pipe cap constants for styled appearance
const PIPE_CAP_HEIGHT = 26;  // Height of the pipe cap at gap edges
const PIPE_CAP_OVERHANG = 4;  // How much the cap extends past the pipe body on each side

// Dusk building palette for the sky theme cityscape obstacles
const SKY_BUILDING_COLORS = ['#3b4a63', '#46506b', '#2f3c55', '#525a73', '#3a4560'];

// Draw a single skyscraper obstacle (windows + roof) for the sky theme.
// facingDown = top obstacle that hangs from the ceiling; otherwise it rises
// from the ground. seed keeps window/colour choices stable per building.
function drawSkyBuilding(x, y, height, facingDown, seed) {
    if (height <= 0) return;

    const colorIndex = Math.floor(seed / 11) % SKY_BUILDING_COLORS.length;
    const body = SKY_BUILDING_COLORS[(colorIndex + SKY_BUILDING_COLORS.length) % SKY_BUILDING_COLORS.length];

    // Building body
    ctx.fillStyle = body;
    ctx.fillRect(x, y, PIPE_WIDTH, height);

    // Outline for definition against the dusk sky
    ctx.strokeStyle = '#1b2336';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, PIPE_WIDTH, height);

    // Roof / parapet band on the gap-facing edge (lighter, catches the light)
    const capHeight = 5;
    const capY = facingDown ? (y + height - capHeight) : y;
    ctx.fillStyle = '#6b7799';
    ctx.fillRect(x - 1, capY, PIPE_WIDTH + 2, capHeight);
    ctx.strokeStyle = '#1b2336';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 1, capY, PIPE_WIDTH + 2, capHeight);

    // Lit / dark windows in a regular grid
    const marginX = 7;
    const marginY = 8;
    const winW = 5;
    const winH = 7;
    const stepX = 11;
    const stepY = 13;
    for (let row = 0; ; row++) {
        const wy = y + marginY + row * stepY;
        if (wy + winH > y + height - marginY) break;
        for (let col = 0; ; col++) {
            const wx = x + marginX + col * stepX;
            if (wx + winW > x + PIPE_WIDTH - marginX) break;
            const lit = ((col * 2 + row * 3 + seed) % 4) === 0;
            ctx.fillStyle = lit ? 'rgba(245,200,120,0.92)' : '#26324a';
            ctx.fillRect(wx, wy, winW, winH);
        }
    }
}

// Render the obstacles as a flush row of city buildings (sky theme)
function renderSkyBuildings() {
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        // Top obstacle: skyscraper hanging from the top edge
        drawSkyBuilding(pipe.x, 0, pipe.topHeight, true, pipe.topHeight);
        // Bottom obstacle: skyscraper rising from the shoreline
        drawSkyBuilding(pipe.x, pipe.bottomY, groundY - pipe.bottomY, false, pipe.topHeight + 5);
    }
}

// Render pipes with styled appearance (caps at gap edges, outlines)
function renderPipes() {
    // Travel-themed skin: obstacles are little buildings forming a cityscape
    if (isSkyTheme) return renderSkyBuildings();

    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    // Loop through all pipes in the array
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        // Calculate cap dimensions
        const capX = pipe.x - PIPE_CAP_OVERHANG;  // Cap extends past pipe body
        const capWidth = PIPE_WIDTH + (PIPE_CAP_OVERHANG * 2);  // Cap is wider than pipe body

        // ===== TOP PIPE =====
        // Draw top pipe body (from top of canvas to topHeight - cap height)
        const topPipeBodyHeight = pipe.topHeight - PIPE_CAP_HEIGHT;
        if (topPipeBodyHeight > 0) {
            // Pipe body fill (green)
            ctx.fillStyle = '#228B22';  // Forest green for pipe body
            ctx.fillRect(pipe.x, 0, PIPE_WIDTH, topPipeBodyHeight);

            // Pipe body outline (darker green)
            ctx.strokeStyle = '#1a6b1a';  // Darker green outline
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, topPipeBodyHeight);
        }

        // Draw top pipe cap (wider section at the bottom of top pipe, at gap edge)
        const topCapY = pipe.topHeight - PIPE_CAP_HEIGHT;

        // Cap fill (green)
        ctx.fillStyle = '#228B22';  // Forest green for cap
        ctx.fillRect(capX, topCapY, capWidth, PIPE_CAP_HEIGHT);

        // Cap outline (darker green)
        ctx.strokeStyle = '#1a6b1a';  // Darker green outline
        ctx.lineWidth = 2;
        ctx.strokeRect(capX, topCapY, capWidth, PIPE_CAP_HEIGHT);

        // ===== BOTTOM PIPE =====
        // Draw bottom pipe cap (wider section at the top of bottom pipe, at gap edge)
        const bottomCapY = pipe.bottomY;

        // Cap fill (green)
        ctx.fillStyle = '#228B22';  // Forest green for cap
        ctx.fillRect(capX, bottomCapY, capWidth, PIPE_CAP_HEIGHT);

        // Cap outline (darker green)
        ctx.strokeStyle = '#1a6b1a';  // Darker green outline
        ctx.lineWidth = 2;
        ctx.strokeRect(capX, bottomCapY, capWidth, PIPE_CAP_HEIGHT);

        // Draw bottom pipe body (from cap bottom to ground)
        const bottomPipeBodyY = pipe.bottomY + PIPE_CAP_HEIGHT;
        const bottomPipeBodyHeight = groundY - bottomPipeBodyY;
        if (bottomPipeBodyHeight > 0) {
            // Pipe body fill (green)
            ctx.fillStyle = '#228B22';  // Forest green for pipe body
            ctx.fillRect(pipe.x, bottomPipeBodyY, PIPE_WIDTH, bottomPipeBodyHeight);

            // Pipe body outline (darker green)
            ctx.strokeStyle = '#1a6b1a';  // Darker green outline
            ctx.lineWidth = 2;
            ctx.strokeRect(pipe.x, bottomPipeBodyY, PIPE_WIDTH, bottomPipeBodyHeight);
        }
    }
}

// Ground styling constants
const GRASS_HEIGHT = 12;  // Height of the grass strip at top of ground

// Render the shoreline ground for the travel/sky theme (dusk beach + waterline)
function renderSkyGround() {
    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    // Wet sand / shore gradient
    const shore = ctx.createLinearGradient(0, groundY, 0, CANVAS_HEIGHT);
    shore.addColorStop(0, '#5a5360');
    shore.addColorStop(1, '#3b3742');
    ctx.fillStyle = shore;
    ctx.fillRect(0, groundY, CANVAS_WIDTH, GROUND_HEIGHT);

    // Bright waterline lapping at the top edge of the shore
    ctx.fillStyle = '#7fa9c4';
    ctx.fillRect(0, groundY, CANVAS_WIDTH, 3);
    ctx.fillStyle = 'rgba(220,235,245,0.5)';
    ctx.fillRect(0, groundY + 3, CANVAS_WIDTH, 2);
}

// Render ground at bottom of canvas with grass strip and texture
function renderGround() {
    // Travel-themed skin: render a dusk shoreline instead of grass/dirt
    if (isSkyTheme) return renderSkyGround();

    const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;

    // ===== GRASS STRIP =====
    // Draw grass-colored strip at top of ground (where it meets sky/playable area)
    ctx.fillStyle = '#7cba3d';  // Bright grass green color
    ctx.fillRect(0, groundY, CANVAS_WIDTH, GRASS_HEIGHT);

    // Add slightly darker grass line at very top for definition
    ctx.fillStyle = '#5a9a2b';  // Darker green for grass edge
    ctx.fillRect(0, groundY, CANVAS_WIDTH, 2);

    // ===== DIRT/GROUND BASE =====
    // Draw tan/brown dirt below grass strip
    const dirtY = groundY + GRASS_HEIGHT;
    const dirtHeight = GROUND_HEIGHT - GRASS_HEIGHT;
    ctx.fillStyle = '#deb887';  // Tan/brown color for dirt
    ctx.fillRect(0, dirtY, CANVAS_WIDTH, dirtHeight);

    // ===== TEXTURE PATTERN (horizontal stripes) =====
    // Add simple stripe texture to ground for visual interest
    ctx.fillStyle = '#c9a76c';  // Slightly darker tan for stripes
    const stripeHeight = 4;
    const stripeSpacing = 16;  // Distance between stripes

    // Draw horizontal stripes across the dirt area
    for (let y = dirtY + 8; y < CANVAS_HEIGHT; y += stripeSpacing) {
        ctx.fillRect(0, y, CANVAS_WIDTH, stripeHeight);
    }

    // ===== GROUND OUTLINE =====
    // Add dark outline at the very bottom of grass strip for definition
    ctx.strokeStyle = '#4a8a1b';  // Dark green outline
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY + GRASS_HEIGHT);
    ctx.lineTo(CANVAS_WIDTH, groundY + GRASS_HEIGHT);
    ctx.stroke();
}

// Render score at top center of canvas
function renderScore() {
    ctx.font = '48px sans-serif';  // Large font size for visibility
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'top';  // Align text from top
    
    // Add dark outline for readability
    ctx.strokeStyle = '#000000';  // Black outline
    ctx.lineWidth = 3;  // Outline width
    ctx.strokeText(score.toString(), CANVAS_WIDTH / 2, 20);  // Draw outline first
    
    // Draw text fill
    ctx.fillStyle = '#ffffff';  // White color
    ctx.fillText(score.toString(), CANVAS_WIDTH / 2, 20);  // Draw score at top center
}

// Render start screen UI (title and instructions)
function renderStartScreen() {
    // Draw 'Flappy Bird' title text (centered)
    ctx.font = 'bold 64px sans-serif';  // Large, bold font for title
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'middle';  // Align text from center
    
    // Add dark outline for readability
    ctx.strokeStyle = '#000000';  // Black outline
    ctx.lineWidth = 4;  // Outline width for title
    ctx.strokeText('Flappy Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);  // Draw outline first
    
    // Draw text fill
    ctx.fillStyle = '#ffffff';  // White color
    ctx.fillText('Flappy Bird', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);  // Draw title centered, slightly above center
    
    // Draw 'Press Space or Click to Start' instruction
    ctx.font = '24px sans-serif';  // Smaller font for instructions
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'middle';  // Align text from center
    
    // Add dark outline for readability
    ctx.strokeStyle = '#000000';  // Black outline
    ctx.lineWidth = 2;  // Outline width for instructions
    ctx.strokeText('Press Space or Click to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);  // Draw outline first
    
    // Draw text fill
    ctx.fillStyle = '#ffffff';  // White color
    ctx.fillText('Press Space or Click to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);  // Draw instructions below title
}

// Render game over screen UI (game over message and final score)
function renderGameOverScreen() {
    // Draw 'Game Over' text (centered)
    ctx.font = 'bold 64px sans-serif';  // Large, bold font for title
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'middle';  // Align text from center
    
    // Add dark outline for readability
    ctx.strokeStyle = '#000000';  // Black outline
    ctx.lineWidth = 4;  // Outline width for title
    ctx.strokeText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);  // Draw outline first
    
    // Draw text fill
    ctx.fillStyle = '#ffffff';  // White color
    ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100);  // Draw title centered, slightly above center

    // Draw 'Score: X' showing final score
    ctx.font = '48px sans-serif';  // Large font for score
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'middle';  // Align text from center
    
    // Add dark outline for readability
    ctx.strokeStyle = '#000000';  // Black outline
    ctx.lineWidth = 3;  // Outline width for score
    ctx.strokeText('Score: ' + score.toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);  // Draw outline first
    
    // Draw text fill
    ctx.fillStyle = '#ffffff';  // White color
    ctx.fillText('Score: ' + score.toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);  // Draw score below title

    // Draw 'Best: X' showing high score (styled differently - slightly smaller font, different color)
    ctx.font = '36px sans-serif';  // Slightly smaller font than current score
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'middle';  // Align text from center
    
    // Add dark outline for readability
    ctx.strokeStyle = '#000000';  // Black outline
    ctx.lineWidth = 3;  // Outline width for high score
    ctx.strokeText('Best: ' + highScore.toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);  // Draw outline first
    
    // Draw text fill
    ctx.fillStyle = '#ffd700';  // Gold color for high score
    ctx.fillText('Best: ' + highScore.toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);  // Draw high score below current score

    // Show 'New Best!' message if current score equals high score and score > 0
    // (score equals highScore after saveHighScore() was called, meaning we beat the previous high score)
    if (score === highScore && score > 0) {
        ctx.font = 'bold 28px sans-serif';  // Bold, noticeable font
        ctx.textAlign = 'center';  // Center text horizontally
        ctx.textBaseline = 'middle';  // Align text from center
        
        // Add dark outline for readability
        ctx.strokeStyle = '#000000';  // Black outline
        ctx.lineWidth = 2;  // Outline width for "New Best!"
        ctx.strokeText('New Best!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);  // Draw outline first
        
        // Draw text fill
        ctx.fillStyle = '#ff6b6b';  // Red/coral color for emphasis
        ctx.fillText('New Best!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);  // Draw below high score
    }

    // Draw 'Press Space or Click to Restart' instruction
    ctx.font = '24px sans-serif';  // Smaller font for instructions
    ctx.textAlign = 'center';  // Center text horizontally
    ctx.textBaseline = 'middle';  // Align text from center
    
    // Add dark outline for readability
    ctx.strokeStyle = '#000000';  // Black outline
    ctx.lineWidth = 2;  // Outline width for instructions
    ctx.strokeText('Press Space or Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);  // Draw outline first
    
    // Draw text fill
    ctx.fillStyle = '#ffffff';  // White color
    ctx.fillText('Press Space or Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100);  // Draw instructions below high score
}

// Update function - contains game logic
function update() {
    // Only run game logic if state is 'playing'
    if (!isPlaying()) {
        return;  // Don't update game logic in start or gameover states
    }
    
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

    // If in start state, render start screen UI
    if (isStart()) {
        // Draw game elements that should be visible on start screen
        renderBird();  // Render bird in starting position
        renderGround();  // Render ground
        
        // Draw start screen UI (title and instructions)
        renderStartScreen();
        return;  // Don't render pipes, score, etc. on start screen
    }

    // Draw game elements (only when playing or gameover)
    renderPipes();  // Draw pipes before bird so they appear behind
    renderBird();

    // Draw ground
    renderGround();

    // Draw score
    renderScore();

    // If in gameover state, render game over screen UI
    if (isGameOver()) {
        // Draw game over screen UI (game over message and final score)
        renderGameOverScreen();
    }
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
    loadHighScore();  // Load high score from localStorage
    initBird();
    startGameLoop();
}

// Run initialization when page loads
init();
