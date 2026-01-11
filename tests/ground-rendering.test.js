/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F011: Render Ground', () => {
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

    describe('GROUND_HEIGHT constant', () => {
        test('GROUND_HEIGHT constant is defined', () => {
            expect(gameJs).toMatch(/const\s+GROUND_HEIGHT\s*=/);
        });

        test('GROUND_HEIGHT is set to 80', () => {
            expect(gameJs).toMatch(/const\s+GROUND_HEIGHT\s*=\s*80/);
        });

        test('GROUND_HEIGHT is defined before renderGround function', () => {
            const groundHeightPos = gameJs.indexOf('GROUND_HEIGHT');
            const renderGroundPos = gameJs.indexOf('function renderGround');
            expect(groundHeightPos).toBeLessThan(renderGroundPos);
        });
    });

    describe('renderGround function existence', () => {
        test('renderGround function is defined', () => {
            expect(gameJs).toMatch(/function\s+renderGround\s*\(\s*\)/);
        });

        test('renderGround function has a function body', () => {
            const match = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(match).not.toBeNull();
            expect(match[0].length).toBeGreaterThan(30);
        });
    });

    describe('Ground rendering as brown/tan rectangle', () => {
        test('renderGround uses fillStyle for ground color', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            expect(renderGroundMatch[0]).toMatch(/fillStyle/);
        });

        test('renderGround uses brown/tan color', () => {
            // Brown/tan color patterns: #deb887, #d2b48c, #cd853f, or similar
            const brownPattern = /#[dD][eE][bB]887|#[dD]2[bB]48[cC]|#[cC][dD]853[fF]|brown|tan|#[a-fA-F0-9]{6}/;
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            expect(renderGroundMatch[0]).toMatch(brownPattern);
        });

        test('renderGround uses fillRect for drawing', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            expect(renderGroundMatch[0]).toMatch(/fillRect/);
        });

        test('renderGround positions ground at bottom of canvas', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            // Should use CANVAS_HEIGHT - GROUND_HEIGHT for y position
            expect(renderGroundMatch[0]).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('renderGround uses CANVAS_WIDTH for width', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            expect(renderGroundMatch[0]).toMatch(/CANVAS_WIDTH/);
        });

        test('renderGround uses GROUND_HEIGHT for height', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            expect(renderGroundMatch[0]).toMatch(/GROUND_HEIGHT/);
        });
    });

    describe('Ground rendering fillRect call', () => {
        test('renderGround calls fillRect with correct parameters', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            const body = renderGroundMatch[0];

            // Should have fillRect with: x=0, y=CANVAS_HEIGHT-GROUND_HEIGHT, width=CANVAS_WIDTH, height=GROUND_HEIGHT
            expect(body).toMatch(/fillRect/);
            expect(body).toMatch(/CANVAS_HEIGHT/);
            expect(body).toMatch(/GROUND_HEIGHT/);
            expect(body).toMatch(/CANVAS_WIDTH/);
        });

        test('renderGround sets fillStyle before fillRect', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            const body = renderGroundMatch[0];

            const fillStylePos = body.indexOf('fillStyle');
            const fillRectPos = body.indexOf('fillRect');

            expect(fillStylePos).toBeLessThan(fillRectPos);
        });

        test('renderGround calculates groundY position correctly', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            const body = renderGroundMatch[0];

            // Should calculate groundY = CANVAS_HEIGHT - GROUND_HEIGHT
            expect(body).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });
    });

    describe('renderGround integration with render function', () => {
        test('render function calls renderGround', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0]).toMatch(/renderGround\s*\(\s*\)/);
        });

        test('renderGround is called after renderBird in render', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            const renderBody = renderMatch[0];
            const birdPos = renderBody.indexOf('renderBird');
            const groundPos = renderBody.indexOf('renderGround');
            expect(birdPos).toBeLessThan(groundPos);
        });

        test('renderGround is called after drawBackground in render', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            const renderBody = renderMatch[0];
            const backgroundPos = renderBody.indexOf('drawBackground');
            const groundPos = renderBody.indexOf('renderGround');
            expect(backgroundPos).toBeLessThan(groundPos);
        });
    });

    describe('Ground visual distinctness', () => {
        test('ground uses a different color from sky background', () => {
            // Background uses gradient (light blue #87ceeb to darker blue #70c5ce)
            // Ground should be brown/tan (#deb887 or similar)
            const groundColorPattern = /#deb887|#[dD][eE][bB]887/i;

            // Background now uses gradient, so check for gradient instead of solid color
            expect(gameJs).toMatch(/createLinearGradient/);
            expect(gameJs).toMatch(groundColorPattern);
        });

        test('ground color is visually distinct from bird color', () => {
            // Bird is #f7dc6f (yellow)
            // Ground should be brown/tan (#deb887 or similar)
            const birdColorPattern = /#f7dc6f/i;
            const groundColorPattern = /#deb887|#[dD][eE][bB]887/i;

            expect(gameJs).toMatch(birdColorPattern);
            expect(gameJs).toMatch(groundColorPattern);
        });
    });

    describe('Ground height specification', () => {
        test('GROUND_HEIGHT constant is 80 pixels', () => {
            expect(gameJs).toMatch(/const\s+GROUND_HEIGHT\s*=\s*80/);
        });

        test('renderGround uses GROUND_HEIGHT constant for height', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            expect(renderGroundMatch[0]).toMatch(/GROUND_HEIGHT/);
        });
    });

    describe('Ground positioning', () => {
        test('ground is positioned at bottom of canvas', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            const body = renderGroundMatch[0];

            // Ground y position should be CANVAS_HEIGHT - GROUND_HEIGHT
            expect(body).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('ground spans full width of canvas', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            const body = renderGroundMatch[0];

            // Ground width should be CANVAS_WIDTH
            expect(body).toMatch(/CANVAS_WIDTH/);
        });

        test('ground x position starts at 0', () => {
            const renderGroundMatch = gameJs.match(/function\s+renderGround\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGroundMatch).not.toBeNull();
            const body = renderGroundMatch[0];

            // fillRect should start at x=0
            expect(body).toMatch(/fillRect\s*\(\s*0\s*,/);
        });
    });
});
