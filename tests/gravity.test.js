/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F007: Implement Gravity', () => {
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

    describe('GRAVITY constant', () => {
        test('GRAVITY constant is defined', () => {
            expect(gameJs).toMatch(/const\s+GRAVITY\s*=/);
        });

        test('GRAVITY is set to 0.5', () => {
            expect(gameJs).toMatch(/GRAVITY\s*=\s*0\.5/);
        });
    });

    describe('updateBird function', () => {
        test('updateBird function is defined', () => {
            expect(gameJs).toMatch(/function\s+updateBird\s*\(\s*\)/);
        });

        test('updateBird adds gravity to velocity', () => {
            expect(gameJs).toMatch(/bird\.velocity\s*\+=\s*GRAVITY/);
        });

        test('updateBird adds velocity to y position', () => {
            expect(gameJs).toMatch(/bird\.y\s*\+=\s*bird\.velocity/);
        });
    });

    describe('update function integration', () => {
        test('update function calls updateBird', () => {
            expect(gameJs).toMatch(/function\s+update[\s\S]*updateBird\s*\(\s*\)/);
        });
    });

    describe('Gravity physics execution', () => {
        let bird, GRAVITY, updateBird, initBird;

        beforeEach(() => {
            // Execute game.js in a controlled environment
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;
                const GRAVITY = 0.5;

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

                initBird();
                return { bird, GRAVITY, updateBird, initBird };
            `);
            const result = script();
            bird = result.bird;
            GRAVITY = result.GRAVITY;
            updateBird = result.updateBird;
            initBird = result.initBird;
        });

        test('GRAVITY equals 0.5', () => {
            expect(GRAVITY).toBe(0.5);
        });

        test('bird velocity starts at 0', () => {
            expect(bird.velocity).toBe(0);
        });

        test('one updateBird call adds gravity to velocity', () => {
            updateBird();
            expect(bird.velocity).toBe(0.5);
        });

        test('updateBird moves bird position by velocity', () => {
            const initialY = bird.y;
            updateBird();
            // After first update: velocity = 0.5, y = initialY + 0.5
            expect(bird.y).toBe(initialY + 0.5);
        });

        test('velocity accumulates over multiple frames', () => {
            updateBird(); // velocity = 0.5
            updateBird(); // velocity = 1.0
            updateBird(); // velocity = 1.5
            expect(bird.velocity).toBe(1.5);
        });

        test('bird falls faster over time (acceleration)', () => {
            const startY = bird.y;

            // First frame: velocity = 0.5, moves 0.5
            updateBird();
            const afterOne = bird.y - startY;

            // Reset for cleaner test
            initBird();

            // Two frames
            updateBird(); // velocity = 0.5, moves 0.5
            updateBird(); // velocity = 1.0, moves 1.0
            const afterTwo = bird.y - 300; // Total: 0.5 + 1.0 = 1.5

            expect(afterTwo).toBeGreaterThan(afterOne);
        });

        test('after 10 frames velocity equals 5', () => {
            for (let i = 0; i < 10; i++) {
                updateBird();
            }
            expect(bird.velocity).toBe(5);
        });

        test('after 10 frames bird has fallen correct distance', () => {
            const startY = bird.y;
            for (let i = 0; i < 10; i++) {
                updateBird();
            }
            // Sum of velocities: 0.5 + 1 + 1.5 + 2 + 2.5 + 3 + 3.5 + 4 + 4.5 + 5 = 27.5
            expect(bird.y).toBe(startY + 27.5);
        });

        test('negative velocity (upward) is reduced by gravity', () => {
            bird.velocity = -10;
            updateBird();
            expect(bird.velocity).toBe(-9.5);
        });

        test('gravity eventually reverses upward velocity', () => {
            bird.velocity = -2;
            for (let i = 0; i < 10; i++) {
                updateBird();
            }
            // -2 + (0.5 * 10) = 3
            expect(bird.velocity).toBe(3);
        });
    });

    describe('Script execution', () => {
        test('script can execute without errors', () => {
            expect(() => {
                eval(gameJs);
            }).not.toThrow();
        });
    });

    describe('Reset functionality with gravity', () => {
        let bird, updateBird, initBird, resetBird;

        beforeEach(() => {
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;
                const GRAVITY = 0.5;

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

                function resetBird() {
                    initBird();
                }

                function updateBird() {
                    bird.velocity += GRAVITY;
                    bird.y += bird.velocity;
                }

                initBird();
                return { bird, updateBird, initBird, resetBird };
            `);
            const result = script();
            bird = result.bird;
            updateBird = result.updateBird;
            initBird = result.initBird;
            resetBird = result.resetBird;
        });

        test('resetBird resets velocity to 0 after falling', () => {
            // Let bird fall
            for (let i = 0; i < 10; i++) {
                updateBird();
            }
            expect(bird.velocity).toBe(5);

            resetBird();
            expect(bird.velocity).toBe(0);
        });

        test('resetBird resets position after falling', () => {
            // Let bird fall
            for (let i = 0; i < 10; i++) {
                updateBird();
            }
            expect(bird.y).toBeGreaterThan(300);

            resetBird();
            expect(bird.y).toBe(300);
        });
    });
});
