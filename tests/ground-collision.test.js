/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F012: Implement Ground Collision', () => {
    let gameJs;
    let mockContext;

    beforeEach(() => {
        // Set up DOM with canvas
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;

        // Mock canvas context with tracking for calls
        mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            clearRect: jest.fn(),
            beginPath: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
            stroke: jest.fn(),
            arc: jest.fn(),
            rect: jest.fn(),
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('gameOver flag variable', () => {
        test('gameOver variable is defined', () => {
            expect(gameJs).toMatch(/let\s+gameOver\s*=/);
        });

        test('gameOver is initialized to false', () => {
            expect(gameJs).toMatch(/let\s+gameOver\s*=\s*false/);
        });
    });

    describe('Ground collision detection', () => {
        test('Ground y position is calculated correctly', () => {
            // Ground y = CANVAS_HEIGHT - GROUND_HEIGHT = 600 - 80 = 520
            expect(gameJs).toMatch(/const\s+groundY\s*=\s*CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('Bird bottom edge is calculated correctly', () => {
            // Bird bottom = bird.y + bird.height
            expect(gameJs).toMatch(/birdBottom\s*=\s*bird\.y\s*\+\s*bird\.height/);
        });

        test('Collision check compares bird bottom to ground y', () => {
            expect(gameJs).toMatch(/birdBottom\s*>=\s*groundY/);
        });

        test('gameOver is set to true on ground collision', () => {
            expect(gameJs).toMatch(/gameOver\s*=\s*true/);
        });

        test('Bird position is adjusted to rest on ground surface', () => {
            // bird.y = groundY - bird.height
            expect(gameJs).toMatch(/bird\.y\s*=\s*groundY\s*-\s*bird\.height/);
        });
    });

    describe('Bird movement stops on game over', () => {
        test('updateBird() returns early if gameOver is true', () => {
            expect(gameJs).toMatch(/if\s*\(\s*gameOver\s*\|\|\s*!isPlaying\(\)\s*\)\s*\{/);
            expect(gameJs).toMatch(/return/);
        });

        test('updateBird() checks gameOver before applying physics', () => {
            // Find the updateBird function
            const functionStart = gameJs.indexOf('function updateBird()');
            expect(functionStart).toBeGreaterThanOrEqual(0);
            
            // Find the gameOver check and gravity application within the function
            const gameOverCheckIndex = gameJs.indexOf('if (gameOver || !isPlaying())', functionStart);
            const gravityIndex = gameJs.indexOf('bird.velocity += GRAVITY', functionStart);
            
            expect(gameOverCheckIndex).toBeGreaterThanOrEqual(0);
            expect(gravityIndex).toBeGreaterThanOrEqual(0);
            expect(gameOverCheckIndex).toBeLessThan(gravityIndex);
        });
    });

    describe('Game over flag reset', () => {
        test('initBird() resets gameOver to false', () => {
            expect(gameJs).toMatch(/gameOver\s*=\s*false/);
        });

        test('gameOver reset is in initBird() function', () => {
            const initBirdMatch = gameJs.match(/function\s+initBird\(\)\s*\{[\s\S]*?\}/);
            expect(initBirdMatch).toBeTruthy();
            expect(initBirdMatch[0]).toMatch(/gameOver\s*=\s*false/);
        });
    });

    describe('Integration with existing code', () => {
        test('GROUND_HEIGHT constant is still defined', () => {
            expect(gameJs).toMatch(/const\s+GROUND_HEIGHT\s*=\s*80/);
        });

        test('CANVAS_HEIGHT is used in collision calculation', () => {
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('bird object properties are still accessible', () => {
            expect(gameJs).toMatch(/bird\.y/);
            expect(gameJs).toMatch(/bird\.height/);
        });
    });
});
