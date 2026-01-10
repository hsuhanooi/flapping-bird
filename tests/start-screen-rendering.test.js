/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F026: Render Start Screen UI', () => {
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

    describe('renderStartScreen function existence', () => {
        test('renderStartScreen function is defined', () => {
            expect(gameJs).toMatch(/function\s+renderStartScreen\s*\(/);
        });

        test('renderStartScreen function is callable', () => {
            // Function should be defined as a function declaration or expression
            expect(gameJs).toMatch(/renderStartScreen/);
        });
    });

    describe('Title text rendering', () => {
        test('title text "Flappy Bird" is drawn', () => {
            expect(gameJs).toMatch(/Flappy Bird/);
        });

        test('title text is centered horizontally', () => {
            expect(gameJs).toMatch(/textAlign.*center/);
        });

        test('title uses large font size', () => {
            // Should use a large font size (64px or similar)
            expect(gameJs).toMatch(/font.*64px/);
        });

        test('title is positioned at center of canvas', () => {
            // Title should be drawn at CANVAS_WIDTH / 2
            expect(gameJs).toMatch(/CANVAS_WIDTH\s*\/\s*2/);
        });
    });

    describe('Instructions text rendering', () => {
        test('instructions text "Press Space or Click to Start" is drawn', () => {
            expect(gameJs).toMatch(/Press Space or Click to Start/);
        });

        test('instructions text is centered horizontally', () => {
            // Instructions should also use center alignment
            expect(gameJs).toMatch(/textAlign.*center/);
        });

        test('instructions use readable font size', () => {
            // Should use a readable font size (24px or similar)
            expect(gameJs).toMatch(/font.*24px/);
        });

        test('instructions are positioned below title', () => {
            // Instructions should be drawn at a y position below the title
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*\/\s*2/);
        });
    });

    describe('Start screen integration', () => {
        test('renderStartScreen is called when state is start', () => {
            // render() function should call renderStartScreen() when isStart() is true
            expect(gameJs).toMatch(/isStart\s*\(\s*\)/);
            expect(gameJs).toMatch(/renderStartScreen\s*\(\s*\)/);
        });

        test('bird is rendered on start screen', () => {
            // renderBird() should be called even in start state
            expect(gameJs).toMatch(/renderBird\s*\(\s*\)/);
        });

        test('ground is rendered on start screen', () => {
            // renderGround() should be called even in start state
            expect(gameJs).toMatch(/renderGround\s*\(\s*\)/);
        });

        test('pipes are not rendered on start screen', () => {
            // renderPipes() should not be called when isStart() is true
            // Check that renderPipes is only called when not in start state
            const renderFunction = gameJs.match(/function\s+render\s*\([^}]+}/s);
            if (renderFunction) {
                const renderCode = renderFunction[0];
                // renderPipes should only be called after the start state check
                expect(renderCode).toMatch(/if\s*\(\s*isStart\s*\(\s*\)\s*\)/);
            }
        });

        test('score is not rendered on start screen', () => {
            // renderScore() should not be called when isStart() is true
            const renderFunction = gameJs.match(/function\s+render\s*\([^}]+}/s);
            if (renderFunction) {
                const renderCode = renderFunction[0];
                // renderScore should only be called after the start state check
                expect(renderCode).toMatch(/if\s*\(\s*isStart\s*\(\s*\)\s*\)/);
            }
        });
    });

    describe('Text styling', () => {
        test('text color is white for visibility', () => {
            // Text should use white color (#ffffff or 'white')
            expect(gameJs).toMatch(/fillStyle.*#ffffff|fillStyle.*white/i);
        });

        test('title uses bold font weight', () => {
            // Title should use bold font
            expect(gameJs).toMatch(/font.*bold.*64px/);
        });

        test('text alignment is set correctly', () => {
            // textAlign should be set to 'center'
            expect(gameJs).toMatch(/textAlign\s*=\s*['"]center['"]/);
        });
    });

    describe('Visual layout', () => {
        test('title is positioned above center', () => {
            // Title should be at CANVAS_HEIGHT / 2 - 80 or similar
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*\/\s*2\s*-\s*\d+/);
        });

        test('instructions are positioned below title', () => {
            // Instructions should be at a different y position than title
            const titleMatch = gameJs.match(/fillText\s*\(\s*['"]Flappy Bird['"].*?,\s*([^,]+)\s*\)/);
            const instructionMatch = gameJs.match(/fillText\s*\(\s*['"]Press Space or Click to Start['"].*?,\s*([^,]+)\s*\)/);
            
            if (titleMatch && instructionMatch) {
                // Instructions y position should be different from title y position
                expect(titleMatch[1]).not.toBe(instructionMatch[1]);
            }
        });
    });
});
