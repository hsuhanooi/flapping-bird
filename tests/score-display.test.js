/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F021: Add Score Variable and Display', () => {
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

    describe('Score variable existence', () => {
        test('score variable is defined', () => {
            expect(gameJs).toMatch(/let\s+score\s*=/);
        });

        test('score is initialized to 0', () => {
            expect(gameJs).toMatch(/let\s+score\s*=\s*0/);
        });

        test('score variable is accessible in game code', () => {
            // Score should be used in renderScore or other functions
            expect(gameJs).toMatch(/score/);
        });
    });

    describe('renderScore function existence', () => {
        test('renderScore function is defined', () => {
            expect(gameJs).toMatch(/function\s+renderScore\s*\(\s*\)/);
        });

        test('renderScore function has a function body', () => {
            const match = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(match).not.toBeNull();
            expect(match[0].length).toBeGreaterThan(30);
        });
    });

    describe('Score rendering as white text', () => {
        test('renderScore uses fillStyle for text color', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/fillStyle/);
        });

        test('renderScore uses white color', () => {
            // White color should be used (#ffffff or #fff)
            const whitePattern = /#ffffff|#fff|['"]white['"]/i;
            expect(gameJs).toMatch(whitePattern);
        });

        test('renderScore uses fillText for drawing', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/fillText/);
        });

        test('renderScore uses score variable', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/score/);
        });
    });

    describe('Score text positioning', () => {
        test('renderScore uses textAlign for horizontal alignment', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/textAlign/);
        });

        test('renderScore centers text horizontally', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/textAlign\s*=\s*['"]center['"]/);
        });

        test('renderScore positions text at top center of canvas', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            // Should use CANVAS_WIDTH / 2 for x position
            expect(renderScoreMatch[0]).toMatch(/CANVAS_WIDTH\s*\/\s*2/);
        });

        test('renderScore positions text near top of canvas', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            // Should have a small y value (like 20) for top positioning
            // Check that fillText line contains a small number (like 20) for y position
            expect(renderScoreMatch[0]).toMatch(/fillText[^;]*,\s*20\s*\)/);
        });
    });

    describe('Score font size', () => {
        test('renderScore sets font property', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/font\s*=/);
        });

        test('renderScore uses large font size (48px)', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            // Should have 48px in font string
            expect(renderScoreMatch[0]).toMatch(/48px/);
        });

        test('renderScore uses sans-serif font family', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            // Should have sans-serif in font string
            expect(renderScoreMatch[0]).toMatch(/sans-serif/);
        });
    });

    describe('renderScore integration with render function', () => {
        test('render function calls renderScore', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0]).toMatch(/renderScore\s*\(\s*\)/);
        });

        test('renderScore is called in render function', () => {
            // Verify renderScore is part of the render function
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0]).toContain('renderScore');
        });
    });

    describe('Score conversion to string', () => {
        test('renderScore converts score to string for display', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            // Should use toString() or string conversion
            expect(renderScoreMatch[0]).toMatch(/score\.toString|String\s*\(\s*score\s*\)|`\$\{score\}`/);
        });
    });

    describe('Score reset functionality', () => {
        test('score is reset to 0 in initBird function', () => {
            const initBirdMatch = gameJs.match(/function\s+initBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(initBirdMatch).not.toBeNull();
            expect(initBirdMatch[0]).toMatch(/score\s*=\s*0/);
        });
    });

    describe('Score display visibility', () => {
        test('score text is drawn at top center for maximum visibility', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            const body = renderScoreMatch[0];

            // Should have textAlign = 'center'
            expect(body).toMatch(/textAlign\s*=\s*['"]center['"]/);
            // Should use CANVAS_WIDTH / 2 for x position
            expect(body).toMatch(/CANVAS_WIDTH\s*\/\s*2/);
        });

        test('score uses white color for visibility against background', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            // Should set fillStyle to white (#ffffff or #fff)
            expect(renderScoreMatch[0]).toMatch(/fillStyle\s*=\s*['"]#fff|#ffffff['"]/i);
        });
    });
});
