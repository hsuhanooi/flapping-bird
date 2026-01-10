/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Tests for F008: Add Keyboard Flap Input

describe('F008: Add Keyboard Flap Input', () => {
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

    describe('FLAP_STRENGTH constant', () => {
        test('FLAP_STRENGTH constant is defined', () => {
            expect(gameJs).toMatch(/const\s+FLAP_STRENGTH\s*=/);
        });

        test('FLAP_STRENGTH is set to -8 (negative for upward)', () => {
            expect(gameJs).toMatch(/FLAP_STRENGTH\s*=\s*-8/);
        });
    });

    describe('flap function', () => {
        test('flap function is defined', () => {
            expect(gameJs).toMatch(/function\s+flap\s*\(\s*\)/);
        });

        test('flap sets bird velocity to FLAP_STRENGTH', () => {
            expect(gameJs).toMatch(/bird\.velocity\s*=\s*FLAP_STRENGTH/);
        });
    });

    describe('handleKeyDown function', () => {
        test('handleKeyDown function is defined', () => {
            expect(gameJs).toMatch(/function\s+handleKeyDown\s*\(\s*event\s*\)/);
        });

        test('handleKeyDown checks for Space code', () => {
            expect(gameJs).toMatch(/event\.code\s*===\s*['"]Space['"]/);
        });

        test('handleKeyDown checks for keyCode 32', () => {
            expect(gameJs).toMatch(/event\.keyCode\s*===\s*32/);
        });

        test('handleKeyDown calls preventDefault', () => {
            expect(gameJs).toMatch(/event\.preventDefault\s*\(\s*\)/);
        });

        test('handleKeyDown calls flap', () => {
            expect(gameJs).toMatch(/function\s+handleKeyDown[\s\S]*flap\s*\(\s*\)/);
        });
    });

    describe('Event listener setup', () => {
        test('keydown event listener is added to document', () => {
            expect(gameJs).toMatch(/document\.addEventListener\s*\(\s*['"]keydown['"]\s*,\s*handleKeyDown\s*\)/);
        });
    });

    describe('Flap function execution', () => {
        let bird, FLAP_STRENGTH, flap, initBird;

        beforeEach(() => {
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;
                const GRAVITY = 0.5;
                const FLAP_STRENGTH = -8;

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

                function flap() {
                    bird.velocity = FLAP_STRENGTH;
                }

                initBird();
                return { bird, FLAP_STRENGTH, flap, initBird };
            `);
            const result = script();
            bird = result.bird;
            FLAP_STRENGTH = result.FLAP_STRENGTH;
            flap = result.flap;
            initBird = result.initBird;
        });

        test('FLAP_STRENGTH equals -8', () => {
            expect(FLAP_STRENGTH).toBe(-8);
        });

        test('flap sets bird velocity to FLAP_STRENGTH', () => {
            bird.velocity = 0;
            flap();
            expect(bird.velocity).toBe(-8);
        });

        test('flap sets velocity to negative value (upward)', () => {
            bird.velocity = 5; // Falling
            flap();
            expect(bird.velocity).toBeLessThan(0);
        });

        test('flap overrides positive velocity (falling)', () => {
            bird.velocity = 10;
            flap();
            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('flap overrides negative velocity (already rising)', () => {
            bird.velocity = -5;
            flap();
            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('flap overrides zero velocity', () => {
            bird.velocity = 0;
            flap();
            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });
    });

    describe('handleKeyDown execution', () => {
        let bird, handleKeyDown, flap;

        beforeEach(() => {
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const FLAP_STRENGTH = -8;

                const bird = {
                    x: 80,
                    y: 300,
                    width: 34,
                    height: 24,
                    velocity: 0
                };

                function flap() {
                    bird.velocity = FLAP_STRENGTH;
                }

                function handleKeyDown(event) {
                    if (event.code === 'Space' || event.keyCode === 32) {
                        event.preventDefault();
                        flap();
                    }
                }

                return { bird, handleKeyDown, flap };
            `);
            const result = script();
            bird = result.bird;
            handleKeyDown = result.handleKeyDown;
            flap = result.flap;
        });

        test('spacebar press (code: Space) triggers flap', () => {
            bird.velocity = 0;
            const event = {
                code: 'Space',
                keyCode: 32,
                preventDefault: jest.fn()
            };
            handleKeyDown(event);
            expect(bird.velocity).toBe(-8);
        });

        test('spacebar press (keyCode: 32) triggers flap', () => {
            bird.velocity = 0;
            const event = {
                code: '',
                keyCode: 32,
                preventDefault: jest.fn()
            };
            handleKeyDown(event);
            expect(bird.velocity).toBe(-8);
        });

        test('spacebar press calls preventDefault', () => {
            const mockPreventDefault = jest.fn();
            const event = {
                code: 'Space',
                keyCode: 32,
                preventDefault: mockPreventDefault
            };
            handleKeyDown(event);
            expect(mockPreventDefault).toHaveBeenCalled();
        });

        test('Enter key does not trigger flap', () => {
            bird.velocity = 0;
            const event = {
                code: 'Enter',
                keyCode: 13,
                preventDefault: jest.fn()
            };
            handleKeyDown(event);
            expect(bird.velocity).toBe(0);
        });

        test('Arrow key does not trigger flap', () => {
            bird.velocity = 0;
            const event = {
                code: 'ArrowUp',
                keyCode: 38,
                preventDefault: jest.fn()
            };
            handleKeyDown(event);
            expect(bird.velocity).toBe(0);
        });

        test('non-spacebar keys do not call preventDefault', () => {
            const mockPreventDefault = jest.fn();
            const event = {
                code: 'Enter',
                keyCode: 13,
                preventDefault: mockPreventDefault
            };
            handleKeyDown(event);
            expect(mockPreventDefault).not.toHaveBeenCalled();
        });
    });

    describe('Flap with gravity physics', () => {
        let bird, GRAVITY, FLAP_STRENGTH, flap, updateBird, initBird;

        beforeEach(() => {
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;
                const GRAVITY = 0.5;
                const FLAP_STRENGTH = -8;

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

                function updateBird() {
                    bird.velocity += GRAVITY;
                    bird.y += bird.velocity;
                }

                function flap() {
                    bird.velocity = FLAP_STRENGTH;
                }

                initBird();
                return { bird, GRAVITY, FLAP_STRENGTH, flap, updateBird, initBird };
            `);
            const result = script();
            bird = result.bird;
            GRAVITY = result.GRAVITY;
            FLAP_STRENGTH = result.FLAP_STRENGTH;
            flap = result.flap;
            updateBird = result.updateBird;
            initBird = result.initBird;
        });

        test('bird moves upward after flap', () => {
            const initialY = bird.y;
            flap();
            updateBird();
            // After flap: velocity = -8, then gravity: velocity = -7.5
            // Position: initialY + (-7.5) = initialY - 7.5
            expect(bird.y).toBeLessThan(initialY);
        });

        test('bird starts falling after flap due to gravity', () => {
            flap();
            expect(bird.velocity).toBe(-8);

            // Apply gravity multiple times
            updateBird(); // velocity = -7.5
            updateBird(); // velocity = -7.0
            updateBird(); // velocity = -6.5

            // Velocity should still be negative but closer to 0
            expect(bird.velocity).toBeGreaterThan(-8);
            expect(bird.velocity).toBeLessThan(0);
        });

        test('multiple rapid flaps work correctly', () => {
            // First flap
            flap();
            expect(bird.velocity).toBe(-8);

            // Update a few frames
            updateBird();
            updateBird();
            expect(bird.velocity).toBe(-7); // -8 + 0.5 + 0.5

            // Second flap resets velocity
            flap();
            expect(bird.velocity).toBe(-8);
        });

        test('gravity eventually reverses upward velocity from flap', () => {
            flap(); // velocity = -8

            // Apply gravity until velocity becomes positive
            let iterations = 0;
            while (bird.velocity < 0 && iterations < 100) {
                updateBird();
                iterations++;
            }

            // Velocity should be >= 0
            expect(bird.velocity).toBeGreaterThanOrEqual(0);

            // Should take about 16-17 frames for velocity to go from -8 to 0+
            // -8 + (0.5 * 16) = -8 + 8 = 0
            expect(iterations).toBeLessThanOrEqual(20);
        });

        test('flap from falling state reverses direction immediately', () => {
            // Let bird fall for a while
            for (let i = 0; i < 10; i++) {
                updateBird();
            }
            expect(bird.velocity).toBe(5); // 0.5 * 10

            // Flap should immediately set upward velocity
            flap();
            expect(bird.velocity).toBe(-8);
        });
    });

    describe('Script execution', () => {
        test('script can execute without errors', () => {
            expect(() => {
                eval(gameJs);
            }).not.toThrow();
        });
    });
});
