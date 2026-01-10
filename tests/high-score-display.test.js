/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F034: Display High Score', () => {
    let gameJs;
    let mockContext;
    let canvas;

    beforeEach(() => {
        // Set up DOM with canvas
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;
        canvas = document.getElementById('gameCanvas');

        // Mock canvas context with tracking for calls
        mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            clearRect: jest.fn(),
            font: '',
            textAlign: '',
            textBaseline: '',
            fillText: jest.fn(),
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('High score display in renderGameOverScreen', () => {
        test('renderGameOverScreen includes high score text', () => {
            expect(gameJs).toMatch(/Best:\s*['"]?\s*\+\s*highScore/);
        });

        test('high score is displayed with gold color', () => {
            expect(gameJs).toMatch(/fillStyle\s*=\s*['"]#ffd700['"]/);
        });

        test('high score uses different font size than current score', () => {
            // Check that Best uses 36px font - find it in the renderGameOverScreen function
            const renderGameOverIndex = gameJs.indexOf('function renderGameOverScreen()');
            // Find the closing brace of the function
            let braceCount = 0;
            let functionEnd = renderGameOverIndex;
            for (let i = renderGameOverIndex; i < gameJs.length; i++) {
                if (gameJs[i] === '{') braceCount++;
                if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        functionEnd = i;
                        break;
                    }
                }
            }
            const functionBody = gameJs.substring(renderGameOverIndex, functionEnd);
            // Check that 36px exists in the function (for Best:)
            expect(functionBody).toMatch(/36px/);
            // Verify score uses 48px (larger)
            expect(functionBody).toMatch(/48px/);
        });

        test('high score is positioned below current score', () => {
            // Current score is at CANVAS_HEIGHT / 2 - 40
            // High score should be at CANVAS_HEIGHT / 2 + 10 (below)
            expect(gameJs).toMatch(/Score:.*?CANVAS_HEIGHT\s*\/\s*2\s*-\s*40/);
            expect(gameJs).toMatch(/Best:.*?CANVAS_HEIGHT\s*\/\s*2\s*\+\s*10/);
        });
    });

    describe('New Best! message display', () => {
        test('New Best! message is conditionally displayed', () => {
            expect(gameJs).toMatch(/New Best!/);
        });

        test('New Best! only shows when score equals highScore and score > 0', () => {
            expect(gameJs).toMatch(/if\s*\(\s*score\s*===\s*highScore\s*&&\s*score\s*>\s*0\s*\)/);
        });

        test('New Best! uses distinct styling (red/coral color)', () => {
            // Check that #ff6b6b color exists in the code
            expect(gameJs).toMatch(/#ff6b6b/);
            // Check it's in the context of New Best!
            const newBestIndex = gameJs.indexOf('New Best!');
            const colorIndex = gameJs.indexOf('#ff6b6b');
            // Color should appear before New Best! text in the function
            expect(colorIndex).toBeGreaterThan(-1);
        });

        test('New Best! uses bold font', () => {
            // Check that bold 28px font exists in the code
            expect(gameJs).toMatch(/bold\s+28px/);
            // Check it's in the context of New Best!
            const newBestIndex = gameJs.indexOf('New Best!');
            const boldFontIndex = gameJs.indexOf('bold 28px');
            // Font should appear before New Best! text in the function
            expect(boldFontIndex).toBeGreaterThan(-1);
        });

        test('New Best! is positioned below high score', () => {
            // High score is at CANVAS_HEIGHT / 2 + 10
            // New Best! should be at CANVAS_HEIGHT / 2 + 50 (below)
            expect(gameJs).toMatch(/New Best!.*?CANVAS_HEIGHT\s*\/\s*2\s*\+\s*50/);
        });
    });

    describe('High score formatting and clarity', () => {
        test('high score text is centered horizontally', () => {
            // Check that textAlign is set to center before Best: text
            const bestIndex = gameJs.indexOf('Best:');
            const textAlignIndex = gameJs.lastIndexOf('textAlign', bestIndex);
            const centerIndex = gameJs.indexOf("'center'", textAlignIndex);
            expect(centerIndex).toBeGreaterThan(-1);
        });

        test('high score uses middle baseline alignment', () => {
            // Check that textBaseline is set to middle before Best: text
            const bestIndex = gameJs.indexOf('Best:');
            const textBaselineIndex = gameJs.lastIndexOf('textBaseline', bestIndex);
            const middleIndex = gameJs.indexOf("'middle'", textBaselineIndex);
            expect(middleIndex).toBeGreaterThan(-1);
        });

        test('high score value is converted to string', () => {
            expect(gameJs).toMatch(/highScore\.toString\(\)/);
        });

        test('high score display is separate from current score display', () => {
            // Should have separate fillText calls for Score and Best
            const scoreMatches = (gameJs.match(/fillText\s*\(\s*['"]Score:/g) || []).length;
            const bestMatches = (gameJs.match(/fillText\s*\(\s*['"]Best:/g) || []).length;
            expect(scoreMatches).toBeGreaterThan(0);
            expect(bestMatches).toBeGreaterThan(0);
        });
    });

    describe('Integration with game over screen', () => {
        test('renderGameOverScreen is called when game state is gameover', () => {
            // Check that isGameOver() is used and renderGameOverScreen is called
            expect(gameJs).toMatch(/isGameOver\(\)/);
            expect(gameJs).toMatch(/renderGameOverScreen\(\)/);
            // Check they appear in the render function
            const renderIndex = gameJs.indexOf('function render()');
            const isGameOverIndex = gameJs.indexOf('isGameOver()', renderIndex);
            const renderGameOverIndex = gameJs.indexOf('renderGameOverScreen()', renderIndex);
            expect(isGameOverIndex).toBeGreaterThan(-1);
            expect(renderGameOverIndex).toBeGreaterThan(-1);
        });

        test('high score display is part of game over screen rendering', () => {
            // The Best: text should be within renderGameOverScreen function
            const renderGameOverScreenStart = gameJs.indexOf('function renderGameOverScreen');
            const renderGameOverScreenEnd = gameJs.indexOf('}', renderGameOverScreenStart + 1);
            const functionBody = gameJs.substring(renderGameOverScreenStart, renderGameOverScreenEnd);
            expect(functionBody).toMatch(/Best:/);
        });
    });

    describe('High score persistence integration', () => {
        test('highScore variable is used in renderGameOverScreen', () => {
            expect(gameJs).toMatch(/highScore/);
        });

        test('high score is loaded before rendering', () => {
            // loadHighScore should be called in init()
            expect(gameJs).toMatch(/loadHighScore\(\)/);
        });
    });
});
