/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F006: Render Bird', () => {
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

    describe('renderBird function existence', () => {
        test('renderBird function is defined', () => {
            expect(gameJs).toMatch(/function\s+renderBird\s*\(\s*\)/);
        });

        test('renderBird function has a function body', () => {
            const match = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(match).not.toBeNull();
            expect(match[0].length).toBeGreaterThan(30);
        });
    });

    describe('Bird rendering as yellow rectangle', () => {
        test('renderBird uses fillStyle for bird color', () => {
            // Check that fillStyle is set within or before renderBird
            expect(gameJs).toMatch(/renderBird[\s\S]*fillStyle/);
        });

        test('renderBird uses yellow color', () => {
            // Yellow color should be used (various shades of yellow)
            const yellowPattern = /#[fF][0-9a-fA-F]{5}|yellow|#[fF]{2}[dDeE][0-9a-fA-F]{3}/;
            expect(gameJs).toMatch(yellowPattern);
        });

        test('renderBird uses fillRect for drawing', () => {
            expect(gameJs).toMatch(/renderBird[\s\S]*fillRect/);
        });

        test('renderBird uses bird.x for x position', () => {
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();
            expect(renderBirdMatch[0]).toMatch(/bird\.x/);
        });

        test('renderBird uses bird.y for y position', () => {
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();
            expect(renderBirdMatch[0]).toMatch(/bird\.y/);
        });

        test('renderBird uses bird.width for width', () => {
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();
            expect(renderBirdMatch[0]).toMatch(/bird\.width/);
        });

        test('renderBird uses bird.height for height', () => {
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();
            expect(renderBirdMatch[0]).toMatch(/bird\.height/);
        });
    });

    describe('renderBird integration with render function', () => {
        test('render function calls renderBird', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0]).toMatch(/renderBird\s*\(\s*\)/);
        });

        test('renderBird is called after drawBackground in render', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            const renderBody = renderMatch[0];
            const backgroundPos = renderBody.indexOf('drawBackground');
            const birdPos = renderBody.indexOf('renderBird');
            expect(backgroundPos).toBeLessThan(birdPos);
        });
    });

    describe('Bird rendering fillRect call', () => {
        test('renderBird calls fillRect with bird.x, bird.y, bird.width, bird.height', () => {
            // Verify the fillRect call in renderBird uses all bird properties
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();
            const body = renderBirdMatch[0];

            // Should have fillRect with bird properties
            expect(body).toMatch(/fillRect\s*\(\s*bird\.x\s*,\s*bird\.y\s*,\s*bird\.width\s*,\s*bird\.height\s*\)/);
        });

        test('renderBird sets fillStyle before fillRect', () => {
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();
            const body = renderBirdMatch[0];

            const fillStylePos = body.indexOf('fillStyle');
            const fillRectPos = body.indexOf('fillRect');

            expect(fillStylePos).toBeLessThan(fillRectPos);
        });

        test('renderBird uses correct parameters in fillRect', () => {
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();

            // Check that all four bird properties are used in fillRect
            expect(renderBirdMatch[0]).toContain('bird.x');
            expect(renderBirdMatch[0]).toContain('bird.y');
            expect(renderBirdMatch[0]).toContain('bird.width');
            expect(renderBirdMatch[0]).toContain('bird.height');
        });
    });

    describe('Bird color specification', () => {
        test('renderBird sets fillStyle to a yellow color', () => {
            const renderBirdMatch = gameJs.match(/function\s+renderBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderBirdMatch).not.toBeNull();

            // Check for yellow color setting in renderBird
            expect(renderBirdMatch[0]).toMatch(/fillStyle\s*=\s*['"]#[fF]/);
        });

        test('bird uses a distinct color from background', () => {
            // Background is #70c5ce (sky blue)
            // Bird should be yellow (#f7dc6f or similar)
            const birdColorPattern = /#f7dc6f|#[fF][0-9a-fA-F]d[cC]6[fF]/i;

            expect(gameJs).toMatch(/fillStyle\s*=\s*['"]#70c5ce['"]/);
            expect(gameJs).toMatch(birdColorPattern);
        });
    });

    describe('Rendering order', () => {
        test('render function clears canvas first', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            const renderBody = renderMatch[0];
            const clearPos = renderBody.indexOf('clearCanvas');
            const backgroundPos = renderBody.indexOf('drawBackground');
            const birdPos = renderBody.indexOf('renderBird');

            expect(clearPos).toBeLessThan(backgroundPos);
            expect(backgroundPos).toBeLessThan(birdPos);
        });

        test('bird appears on top of background', () => {
            // Since renderBird is called after drawBackground,
            // the bird will be rendered on top
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0].indexOf('drawBackground')).toBeLessThan(
                renderMatch[0].indexOf('renderBird')
            );
        });
    });
});
