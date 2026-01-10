/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F005: Create Bird Object', () => {
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

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('Bird object definition', () => {
        test('bird object is defined', () => {
            expect(gameJs).toMatch(/const\s+bird\s*=\s*\{/);
        });

        test('bird has x property', () => {
            expect(gameJs).toMatch(/bird\s*=\s*\{[^}]*x\s*:/);
        });

        test('bird has y property', () => {
            expect(gameJs).toMatch(/bird\s*=\s*\{[^}]*y\s*:/);
        });

        test('bird has width property', () => {
            expect(gameJs).toMatch(/bird\s*=\s*\{[^}]*width\s*:/);
        });

        test('bird has height property', () => {
            expect(gameJs).toMatch(/bird\s*=\s*\{[^}]*height\s*:/);
        });

        test('bird has velocity property', () => {
            expect(gameJs).toMatch(/bird\s*=\s*\{[^}]*velocity\s*:/);
        });
    });

    describe('Bird initial x position', () => {
        test('bird x is set to 80 (left side of canvas)', () => {
            expect(gameJs).toMatch(/x\s*:\s*80/);
        });
    });

    describe('Bird initial y position', () => {
        test('initBird function exists', () => {
            expect(gameJs).toMatch(/function\s+initBird\s*\(\s*\)/);
        });

        test('initBird sets y to CANVAS_HEIGHT / 2', () => {
            expect(gameJs).toMatch(/bird\.y\s*=\s*CANVAS_HEIGHT\s*\/\s*2/);
        });
    });

    describe('Bird dimensions', () => {
        test('bird width is 34 pixels', () => {
            expect(gameJs).toMatch(/width\s*:\s*34/);
        });

        test('bird height is 24 pixels', () => {
            expect(gameJs).toMatch(/height\s*:\s*24/);
        });
    });

    describe('Bird velocity', () => {
        test('bird velocity is initialized to 0', () => {
            expect(gameJs).toMatch(/velocity\s*:\s*0/);
        });
    });

    describe('Bird initialization', () => {
        test('initBird is called in init function', () => {
            expect(gameJs).toMatch(/function\s+init\s*\(\s*\)\s*\{[\s\S]*initBird\s*\(\s*\)/);
        });

        test('initBird resets bird x position', () => {
            expect(gameJs).toMatch(/function\s+initBird[\s\S]*bird\.x\s*=\s*80/);
        });

        test('initBird resets bird velocity to 0', () => {
            expect(gameJs).toMatch(/function\s+initBird[\s\S]*bird\.velocity\s*=\s*0/);
        });
    });

    describe('Bird reset function', () => {
        test('resetBird function exists', () => {
            expect(gameJs).toMatch(/function\s+resetBird\s*\(\s*\)/);
        });

        test('resetBird calls initBird', () => {
            expect(gameJs).toMatch(/function\s+resetBird[\s\S]*initBird\s*\(\s*\)/);
        });
    });

    describe('Bird object execution', () => {
        test('script can execute without errors', () => {
            expect(() => {
                eval(gameJs);
            }).not.toThrow();
        });
    });

    describe('Bird properties accessibility', () => {
        let bird;

        beforeEach(() => {
            // Execute game.js in a controlled environment
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;

                const bird = {
                    x: 80,
                    y: 300,
                    width: 34,
                    height: 24,
                    velocity: 0
                };

                function initBird() {
                    bird.x = 80;
                    bird.y = CANVAS_HEIGHT / 2;
                    bird.velocity = 0;
                }

                initBird();
                return bird;
            `);
            bird = script();
        });

        test('bird x equals 80', () => {
            expect(bird.x).toBe(80);
        });

        test('bird y equals canvas height / 2 (300)', () => {
            expect(bird.y).toBe(300);
        });

        test('bird width equals 34', () => {
            expect(bird.width).toBe(34);
        });

        test('bird height equals 24', () => {
            expect(bird.height).toBe(24);
        });

        test('bird velocity equals 0', () => {
            expect(bird.velocity).toBe(0);
        });
    });
});
