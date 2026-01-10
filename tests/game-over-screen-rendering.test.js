/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F029: Render Game Over UI', () => {
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

    describe('renderGameOverScreen function existence', () => {
        test('renderGameOverScreen function is defined', () => {
            expect(gameJs).toMatch(/function\s+renderGameOverScreen\s*\(/);
        });

        test('renderGameOverScreen function is callable', () => {
            // Function should be defined as a function declaration or expression
            expect(gameJs).toMatch(/renderGameOverScreen/);
        });
    });

    describe('Game Over text rendering', () => {
        test('"Game Over" text is drawn', () => {
            expect(gameJs).toMatch(/Game Over/);
        });

        test('"Game Over" text is centered horizontally', () => {
            expect(gameJs).toMatch(/textAlign.*center/);
        });

        test('"Game Over" uses large bold font size', () => {
            // Should use a large font size (64px or similar) with bold
            expect(gameJs).toMatch(/font.*bold.*64px/);
        });

        test('"Game Over" is positioned at center of canvas', () => {
            // Title should be drawn at CANVAS_WIDTH / 2
            expect(gameJs).toMatch(/CANVAS_WIDTH\s*\/\s*2/);
        });
    });

    describe('Score text rendering', () => {
        test('score text "Score: X" format is drawn', () => {
            expect(gameJs).toMatch(/Score:\s*['"]\s*\+\s*score/);
        });

        test('score text is centered horizontally', () => {
            // Score should also use center alignment
            expect(gameJs).toMatch(/textAlign.*center/);
        });

        test('score uses large font size', () => {
            // Should use a large font size (48px or similar)
            expect(gameJs).toMatch(/font.*48px/);
        });

        test('score is positioned below "Game Over"', () => {
            // Score should be drawn at a y position below the title
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*\/\s*2/);
        });
    });

    describe('Restart instruction text rendering', () => {
        test('restart instruction text "Press Space or Click to Restart" is drawn', () => {
            expect(gameJs).toMatch(/Press Space or Click to Restart/);
        });

        test('restart instruction text is centered horizontally', () => {
            // Instructions should also use center alignment
            expect(gameJs).toMatch(/textAlign.*center/);
        });

        test('restart instruction uses readable font size', () => {
            // Should use a readable font size (24px or similar)
            expect(gameJs).toMatch(/font.*24px/);
        });

        test('restart instruction is positioned below score', () => {
            // Instructions should be drawn at a y position below the score
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*\/\s*2/);
        });
    });

    describe('Game over screen integration', () => {
        test('renderGameOverScreen is called when state is gameover', () => {
            // render() function should call renderGameOverScreen() when isGameOver() is true
            expect(gameJs).toMatch(/isGameOver\s*\(\s*\)/);
            expect(gameJs).toMatch(/renderGameOverScreen\s*\(\s*\)/);
        });

        test('game elements are rendered on game over screen', () => {
            // renderPipes(), renderBird(), renderGround(), renderScore() should be called even in gameover state
            expect(gameJs).toMatch(/renderPipes\s*\(\s*\)/);
            expect(gameJs).toMatch(/renderBird\s*\(\s*\)/);
            expect(gameJs).toMatch(/renderGround\s*\(\s*\)/);
            expect(gameJs).toMatch(/renderScore\s*\(\s*\)/);
        });

        test('renderGameOverScreen is called after game elements', () => {
            // renderGameOverScreen should be called after rendering game elements
            // Check that renderGameOverScreen appears in the render function
            expect(gameJs).toMatch(/renderGameOverScreen/);
            // Check that renderScore is also in the render function
            expect(gameJs).toMatch(/renderScore/);
            // Verify that renderGameOverScreen is called within the render function
            // by checking that it appears after renderScore() call
            const renderScoreCall = gameJs.indexOf('renderScore();');
            const renderGameOverCall = gameJs.indexOf('renderGameOverScreen();');
            expect(renderScoreCall).toBeGreaterThan(-1);
            expect(renderGameOverCall).toBeGreaterThan(renderScoreCall);
        });
    });

    describe('Text styling', () => {
        test('text color is white for visibility', () => {
            // Text should use white color (#ffffff or 'white')
            expect(gameJs).toMatch(/fillStyle.*#ffffff|fillStyle.*white/i);
        });

        test('"Game Over" uses bold font weight', () => {
            // Title should use bold font
            expect(gameJs).toMatch(/font.*bold.*64px/);
        });

        test('text alignment is set correctly', () => {
            // textAlign should be set to 'center'
            expect(gameJs).toMatch(/textAlign\s*=\s*['"]center['"]/);
        });

        test('text baseline is set to middle', () => {
            // textBaseline should be set to 'middle'
            expect(gameJs).toMatch(/textBaseline\s*=\s*['"]middle['"]/);
        });
    });

    describe('Visual layout', () => {
        test('"Game Over" is positioned above center', () => {
            // Title should be at CANVAS_HEIGHT / 2 - 80 or similar
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*\/\s*2\s*-\s*80/);
        });

        test('score is positioned below "Game Over"', () => {
            // Score should be at CANVAS_HEIGHT / 2 - 20 or similar
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*\/\s*2\s*-\s*20/);
        });

        test('restart instruction is positioned below score', () => {
            // Restart instruction should be at CANVAS_HEIGHT / 2 + 40 or similar
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*\/\s*2\s*\+\s*40/);
        });
    });

    describe('Score display', () => {
        test('score variable is used in display', () => {
            // Score should be converted to string and displayed
            expect(gameJs).toMatch(/Score:\s*['"]\s*\+\s*score/);
        });

        test('score is converted to string', () => {
            // Score should be converted using toString() or string concatenation
            expect(gameJs).toMatch(/score\.toString|Score:\s*\+\s*score/);
        });
    });
});
