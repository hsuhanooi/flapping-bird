/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F020: Implement Bird-Pipe Collision', () => {
    let gameJs;

    beforeEach(() => {
        // Set up DOM with canvas
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;

        // Mock canvas context
        const mockContext = {
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

        // Mock requestAnimationFrame
        global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
        global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

        // Load game.js file
        gameJs = fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('checkPipeCollisions function', () => {
        test('checkPipeCollisions function exists', () => {
            expect(gameJs).toMatch(/function\s+checkPipeCollisions\s*\(/);
        });

        test('checkPipeCollisions returns early if gameOver is true', () => {
            expect(gameJs).toMatch(/if\s*\(\s*gameOver\s*\)\s*\{/);
            expect(gameJs).toMatch(/return/);
        });

        test('checkPipeCollisions creates bird hitbox', () => {
            expect(gameJs).toMatch(/birdHitbox\s*=/);
            expect(gameJs).toMatch(/x:\s*bird\.x/);
            expect(gameJs).toMatch(/y:\s*bird\.y/);
            expect(gameJs).toMatch(/width:\s*bird\.width/);
            expect(gameJs).toMatch(/height:\s*bird\.height/);
        });

        test('checkPipeCollisions loops through pipes array', () => {
            expect(gameJs).toMatch(/for\s*\([^)]*pipes\.length/);
        });

        test('checkPipeCollisions creates top pipe hitbox', () => {
            expect(gameJs).toMatch(/topPipeHitbox\s*=/);
            expect(gameJs).toMatch(/x:\s*pipe\.x/);
            expect(gameJs).toMatch(/y:\s*0/);
            expect(gameJs).toMatch(/width:\s*PIPE_WIDTH/);
            expect(gameJs).toMatch(/height:\s*pipe\.topHeight/);
        });

        test('checkPipeCollisions creates bottom pipe hitbox', () => {
            expect(gameJs).toMatch(/bottomPipeHitbox\s*=/);
            expect(gameJs).toMatch(/y:\s*pipe\.bottomY/);
            expect(gameJs).toMatch(/width:\s*PIPE_WIDTH/);
        });

        test('checkPipeCollisions calls checkCollision for top pipe', () => {
            expect(gameJs).toMatch(/checkCollision\s*\(\s*birdHitbox\s*,\s*topPipeHitbox\s*\)/);
        });

        test('checkPipeCollisions calls checkCollision for bottom pipe', () => {
            expect(gameJs).toMatch(/checkCollision\s*\(\s*birdHitbox\s*,\s*bottomPipeHitbox\s*\)/);
        });

        test('checkPipeCollisions sets gameOver to true on top pipe collision', () => {
            const functionMatch = gameJs.match(/function\s+checkPipeCollisions\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(functionMatch).toBeTruthy();
            expect(functionMatch[0]).toMatch(/gameOver\s*=\s*true/);
        });

        test('checkPipeCollisions sets gameOver to true on bottom pipe collision', () => {
            const functionMatch = gameJs.match(/function\s+checkPipeCollisions\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(functionMatch).toBeTruthy();
            // Should have two instances of gameOver = true (one for top, one for bottom)
            const matches = functionMatch[0].match(/gameOver\s*=\s*true/g);
            expect(matches).toBeTruthy();
            expect(matches.length).toBeGreaterThanOrEqual(2);
        });

        test('checkPipeCollisions returns early after collision detected', () => {
            const functionMatch = gameJs.match(/function\s+checkPipeCollisions\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(functionMatch).toBeTruthy();
            // Should have return statements after setting gameOver
            expect(functionMatch[0]).toMatch(/gameOver\s*=\s*true[\s\S]*?return/);
        });
    });

    describe('Integration with update function', () => {
        test('checkPipeCollisions is called in update function', () => {
            expect(gameJs).toMatch(/checkPipeCollisions\s*\(/);
        });

        test('checkPipeCollisions is called after updatePipes', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(updateMatch).toBeTruthy();
            
            const updatePipesIndex = updateMatch[0].indexOf('updatePipes()');
            const checkPipeCollisionsIndex = updateMatch[0].indexOf('checkPipeCollisions()');
            
            expect(updatePipesIndex).toBeGreaterThanOrEqual(0);
            expect(checkPipeCollisionsIndex).toBeGreaterThanOrEqual(0);
            expect(checkPipeCollisionsIndex).toBeGreaterThan(updatePipesIndex);
        });
    });

    describe('Collision detection logic', () => {
        test('checkPipeCollisions uses checkCollision function', () => {
            expect(gameJs).toMatch(/checkCollision\s*\(/);
        });

        test('checkPipeCollisions calculates groundY for bottom pipe height', () => {
            const functionMatch = gameJs.match(/function\s+checkPipeCollisions\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(functionMatch).toBeTruthy();
            expect(functionMatch[0]).toMatch(/groundY\s*=\s*CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('checkPipeCollisions calculates bottom pipe height correctly', () => {
            const functionMatch = gameJs.match(/function\s+checkPipeCollisions\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(functionMatch).toBeTruthy();
            expect(functionMatch[0]).toMatch(/groundY\s*-\s*pipe\.bottomY/);
        });
    });

    describe('Edge cases', () => {
        test('checkPipeCollisions handles empty pipes array', () => {
            const functionMatch = gameJs.match(/function\s+checkPipeCollisions\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(functionMatch).toBeTruthy();
            // Should loop through pipes array, which handles empty array gracefully
            expect(functionMatch[0]).toMatch(/for\s*\([^)]*pipes\.length/);
        });

        test('checkPipeCollisions does not check collisions when gameOver is true', () => {
            const functionMatch = gameJs.match(/function\s+checkPipeCollisions\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
            expect(functionMatch).toBeTruthy();
            // Should return early if gameOver is true
            expect(functionMatch[0]).toMatch(/if\s*\(\s*gameOver\s*\)[\s\S]*?return/);
        });
    });
});
