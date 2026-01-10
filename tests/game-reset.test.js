/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Tests for F030: Implement Game Reset
// These tests verify the resetGame() function works correctly

describe('F030: Implement Game Reset', () => {
    let gameJs;
    let mockContext;

    beforeEach(() => {
        // Set up DOM with canvas element
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
            fillText: jest.fn(),
            font: '',
            textAlign: '',
            textBaseline: ''
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('resetGame function definition', () => {
        test('resetGame function exists', () => {
            expect(gameJs).toMatch(/function\s+resetGame\s*\(\s*\)/);
        });

        test('resetGame function is defined properly', () => {
            const match = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{/);
            expect(match).toBeTruthy();
        });
    });

    describe('resetGame resets bird position', () => {
        test('resetGame sets bird.x to 80', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toMatch(/bird\.x\s*=\s*80/);
        });

        test('resetGame sets bird.y to CANVAS_HEIGHT / 2', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toMatch(/bird\.y\s*=\s*CANVAS_HEIGHT\s*\/\s*2/);
        });

        test('resetGame sets bird x position to left side of canvas', () => {
            // Bird x position should be 80 (same as initial position)
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('bird.x = 80');
        });

        test('resetGame sets bird y position to vertical center', () => {
            // Bird y position should be CANVAS_HEIGHT / 2
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('bird.y = CANVAS_HEIGHT / 2');
        });
    });

    describe('resetGame resets bird velocity', () => {
        test('resetGame sets bird.velocity to 0', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toMatch(/bird\.velocity\s*=\s*0/);
        });

        test('resetGame resets velocity so bird is stationary', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('bird.velocity = 0');
        });
    });

    describe('resetGame clears pipes array', () => {
        test('resetGame clears pipes array using length = 0', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toMatch(/pipes\.length\s*=\s*0/);
        });

        test('resetGame empties pipes array', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('pipes.length = 0');
        });
    });

    describe('resetGame resets score', () => {
        test('resetGame sets score to 0', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toMatch(/score\s*=\s*0/);
        });

        test('resetGame resets score for new game', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('score = 0');
        });
    });

    describe('resetGame resets frameCount', () => {
        test('resetGame sets frameCount to 0', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toMatch(/frameCount\s*=\s*0/);
        });

        test('resetGame resets frame counter for pipe spawning', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('frameCount = 0');
        });
    });

    describe('resetGame resets gameOver flag', () => {
        test('resetGame sets gameOver to false', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toMatch(/gameOver\s*=\s*false/);
        });

        test('resetGame enables game to be played again', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('gameOver = false');
        });
    });

    describe('resetGame function completeness', () => {
        test('resetGame function resets all required variables', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            const resetGameBody = resetGameMatch[0];

            // All required resets should be present
            expect(resetGameBody).toContain('bird.x = 80');
            expect(resetGameBody).toContain('bird.y = CANVAS_HEIGHT / 2');
            expect(resetGameBody).toContain('bird.velocity = 0');
            expect(resetGameBody).toContain('pipes.length = 0');
            expect(resetGameBody).toContain('score = 0');
            expect(resetGameBody).toContain('frameCount = 0');
            expect(resetGameBody).toContain('gameOver = false');
        });

        test('resetGame function has closing brace', () => {
            const resetGameMatch = gameJs.match(/function\s+resetGame\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(resetGameMatch).toBeTruthy();
            expect(resetGameMatch[0]).toContain('}');
        });
    });

    describe('resetGame integration', () => {
        test('resetGame function is separate from initBird function', () => {
            // resetGame should be a separate function from initBird
            const resetGameCount = (gameJs.match(/function\s+resetGame\s*\(/g) || []).length;
            const initBirdCount = (gameJs.match(/function\s+initBird\s*\(/g) || []).length;

            expect(resetGameCount).toBe(1);
            expect(initBirdCount).toBe(1);
        });

        test('resetGame function is defined after resetBird', () => {
            const resetBirdIndex = gameJs.indexOf('function resetBird()');
            const resetGameIndex = gameJs.indexOf('function resetGame()');

            expect(resetBirdIndex).toBeGreaterThanOrEqual(0);
            expect(resetGameIndex).toBeGreaterThanOrEqual(0);
            expect(resetGameIndex).toBeGreaterThan(resetBirdIndex);
        });

        test('resetGame function is accessible globally', () => {
            // Verify it's not inside another function (should be at top level)
            const resetGameIndex = gameJs.indexOf('function resetGame()');
            const beforeResetGame = gameJs.substring(0, resetGameIndex);

            // Count open and close braces before resetGame to ensure it's at top level
            const openBraces = (beforeResetGame.match(/\{/g) || []).length;
            const closeBraces = (beforeResetGame.match(/\}/g) || []).length;

            // At top level, open and close braces should be equal
            expect(openBraces).toBe(closeBraces);
        });
    });
});
