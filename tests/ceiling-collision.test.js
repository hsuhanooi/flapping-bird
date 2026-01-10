/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F013: Implement Ceiling Collision', () => {
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

    describe('Ceiling collision detection', () => {
        test('Ceiling collision check compares bird top edge to 0', () => {
            expect(gameJs).toMatch(/bird\.y\s*<=\s*0/);
        });

        test('gameOver is set to true on ceiling collision', () => {
            // Find the ceiling collision check
            const ceilingCheckIndex = gameJs.indexOf('bird.y <= 0');
            expect(ceilingCheckIndex).toBeGreaterThanOrEqual(0);
            
            // Check that gameOver is set to true after the check
            const afterCheck = gameJs.substring(ceilingCheckIndex);
            expect(afterCheck).toMatch(/gameOver\s*=\s*true/);
        });

        test('Bird position is adjusted to rest at top of canvas', () => {
            // bird.y = 0 when hitting ceiling
            expect(gameJs).toMatch(/bird\.y\s*=\s*0/);
        });

        test('Ceiling collision check is in updateBird() function', () => {
            const functionStart = gameJs.indexOf('function updateBird()');
            expect(functionStart).toBeGreaterThanOrEqual(0);
            
            const ceilingCheckIndex = gameJs.indexOf('bird.y <= 0', functionStart);
            expect(ceilingCheckIndex).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Ceiling collision order', () => {
        test('Ceiling collision is checked before ground collision', () => {
            const functionStart = gameJs.indexOf('function updateBird()');
            expect(functionStart).toBeGreaterThanOrEqual(0);
            
            const ceilingCheckIndex = gameJs.indexOf('bird.y <= 0', functionStart);
            const groundCheckIndex = gameJs.indexOf('birdBottom >= groundY', functionStart);
            
            expect(ceilingCheckIndex).toBeGreaterThanOrEqual(0);
            expect(groundCheckIndex).toBeGreaterThanOrEqual(0);
            expect(ceilingCheckIndex).toBeLessThan(groundCheckIndex);
        });
    });

    describe('Bird movement stops on ceiling collision', () => {
        test('updateBird() returns early if gameOver is true', () => {
            expect(gameJs).toMatch(/if\s*\(\s*gameOver\s*\)\s*\{/);
            expect(gameJs).toMatch(/return/);
        });

        test('Ceiling collision sets gameOver which stops movement', () => {
            // The early return check should prevent further updates
            const functionStart = gameJs.indexOf('function updateBird()');
            const gameOverCheckIndex = gameJs.indexOf('if (gameOver)', functionStart);
            const ceilingCheckIndex = gameJs.indexOf('bird.y <= 0', functionStart);
            
            expect(gameOverCheckIndex).toBeGreaterThanOrEqual(0);
            expect(ceilingCheckIndex).toBeGreaterThanOrEqual(0);
            // gameOver check should come before ceiling check
            expect(gameOverCheckIndex).toBeLessThan(ceilingCheckIndex);
        });
    });

    describe('Integration with existing code', () => {
        test('gameOver flag variable exists', () => {
            expect(gameJs).toMatch(/let\s+gameOver\s*=/);
        });

        test('CANVAS_HEIGHT is still used for ground collision', () => {
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('bird object properties are still accessible', () => {
            expect(gameJs).toMatch(/bird\.y/);
        });

        test('Ground collision still works after ceiling collision addition', () => {
            expect(gameJs).toMatch(/birdBottom\s*>=\s*groundY/);
        });
    });

    describe('Edge cases', () => {
        test('Bird exactly at y=0 triggers collision', () => {
            // The check uses <= so y=0 should trigger
            expect(gameJs).toMatch(/bird\.y\s*<=\s*0/);
        });

        test('Bird above canvas (negative y) triggers collision', () => {
            // The check uses <= so negative y should trigger
            expect(gameJs).toMatch(/bird\.y\s*<=\s*0/);
        });
    });
});
