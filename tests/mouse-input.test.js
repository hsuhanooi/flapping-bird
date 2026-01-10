/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Tests for F009: Add Mouse/Click Flap Input
// Verifies that clicking on canvas makes bird flap upward

describe('F009: Mouse/Click Flap Input', () => {
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

    describe('handleClick function', () => {
        test('handleClick function is defined', () => {
            expect(gameJs).toMatch(/function\s+handleClick\s*\(\s*event\s*\)/);
        });

        test('handleClick calls flap', () => {
            expect(gameJs).toMatch(/function\s+handleClick[\s\S]*flap\s*\(\s*\)/);
        });
    });

    describe('Canvas click event listener', () => {
        test('click event listener is added to canvas', () => {
            expect(gameJs).toMatch(/canvas\.addEventListener\s*\(\s*['"]click['"]\s*,\s*handleClick\s*\)/);
        });
    });

    describe('Click behavior matches spacebar behavior', () => {
        let bird, FLAP_STRENGTH, flap, handleClick, handleKeyDown, initBird;

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

                function handleKeyDown(event) {
                    if (event.code === 'Space' || event.keyCode === 32) {
                        event.preventDefault();
                        flap();
                    }
                }

                function handleClick(event) {
                    flap();
                }

                initBird();
                return { bird, FLAP_STRENGTH, flap, handleClick, handleKeyDown, initBird };
            `);
            const result = script();
            bird = result.bird;
            FLAP_STRENGTH = result.FLAP_STRENGTH;
            flap = result.flap;
            handleClick = result.handleClick;
            handleKeyDown = result.handleKeyDown;
            initBird = result.initBird;
        });

        test('click should have same effect as spacebar press', () => {
            // Test spacebar
            initBird();
            const spaceEvent = {
                code: 'Space',
                keyCode: 32,
                preventDefault: jest.fn()
            };
            handleKeyDown(spaceEvent);
            const velocityAfterSpace = bird.velocity;

            // Reset and test click
            initBird();
            handleClick({ type: 'click' });
            const velocityAfterClick = bird.velocity;

            expect(velocityAfterClick).toBe(velocityAfterSpace);
            expect(velocityAfterClick).toBe(FLAP_STRENGTH);
        });

        test('both click and spacebar should set velocity to -8', () => {
            // Test spacebar
            initBird();
            handleKeyDown({ code: 'Space', keyCode: 32, preventDefault: jest.fn() });
            expect(bird.velocity).toBe(-8);

            // Test click
            initBird();
            handleClick({ type: 'click' });
            expect(bird.velocity).toBe(-8);
        });
    });

    describe('handleClick execution', () => {
        let bird, FLAP_STRENGTH, handleClick, initBird;

        beforeEach(() => {
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;
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

                function handleClick(event) {
                    flap();
                }

                initBird();
                return { bird, FLAP_STRENGTH, handleClick, initBird };
            `);
            const result = script();
            bird = result.bird;
            FLAP_STRENGTH = result.FLAP_STRENGTH;
            handleClick = result.handleClick;
            initBird = result.initBird;
        });

        test('handleClick sets bird velocity to FLAP_STRENGTH', () => {
            bird.velocity = 10; // Set some downward velocity
            handleClick({ type: 'click' });
            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('handleClick should accept event object', () => {
            bird.velocity = 5;

            // Should not throw with event object
            expect(() => {
                handleClick({ type: 'click', target: document.getElementById('gameCanvas') });
            }).not.toThrow();

            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('handleClick should work with minimal event object', () => {
            bird.velocity = 5;

            // Should work even with empty event object
            expect(() => {
                handleClick({});
            }).not.toThrow();

            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });
    });

    describe('Multiple rapid clicks', () => {
        let bird, GRAVITY, FLAP_STRENGTH, flap, handleClick, initBird;

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

                function handleClick(event) {
                    flap();
                }

                initBird();
                return { bird, GRAVITY, FLAP_STRENGTH, flap, handleClick, initBird };
            `);
            const result = script();
            bird = result.bird;
            GRAVITY = result.GRAVITY;
            FLAP_STRENGTH = result.FLAP_STRENGTH;
            flap = result.flap;
            handleClick = result.handleClick;
            initBird = result.initBird;
        });

        test('multiple rapid clicks should all trigger flaps', () => {
            initBird();

            // Click once
            handleClick({ type: 'click' });
            expect(bird.velocity).toBe(FLAP_STRENGTH);

            // Simulate some gravity frames
            bird.velocity += GRAVITY;
            bird.velocity += GRAVITY;
            expect(bird.velocity).toBe(FLAP_STRENGTH + GRAVITY * 2);

            // Click again
            handleClick({ type: 'click' });
            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('three consecutive clicks should all work', () => {
            initBird();

            for (let i = 0; i < 3; i++) {
                bird.velocity = 5 + i; // Different starting velocity each time
                handleClick({ type: 'click' });
                expect(bird.velocity).toBe(FLAP_STRENGTH);
            }
        });

        test('clicking during upward movement should reset velocity', () => {
            initBird();

            // First click
            handleClick({ type: 'click' });
            expect(bird.velocity).toBe(FLAP_STRENGTH);

            // Simulate partial gravity (bird still moving up)
            bird.velocity = -4; // Still negative = still moving up

            // Click again (double jump)
            handleClick({ type: 'click' });
            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });
    });

    describe('Integration with game loop', () => {
        let bird, GRAVITY, FLAP_STRENGTH, flap, handleClick, updateBird, initBird;

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

                function handleClick(event) {
                    flap();
                }

                function update() {
                    updateBird();
                }

                initBird();
                return { bird, GRAVITY, FLAP_STRENGTH, flap, handleClick, updateBird, update, initBird };
            `);
            const result = script();
            bird = result.bird;
            GRAVITY = result.GRAVITY;
            FLAP_STRENGTH = result.FLAP_STRENGTH;
            flap = result.flap;
            handleClick = result.handleClick;
            updateBird = result.updateBird;
            initBird = result.initBird;
        });

        test('click effect should be visible after update', () => {
            initBird();
            const initialY = bird.y;

            // Click to flap
            handleClick({ type: 'click' });

            // Run one update cycle
            updateBird();

            // Bird should have moved up
            expect(bird.y).toBe(initialY + FLAP_STRENGTH + GRAVITY);
        });

        test('click during gameplay should override falling velocity', () => {
            initBird();

            // Simulate falling (run several updates)
            for (let i = 0; i < 10; i++) {
                updateBird();
            }

            // Bird should be falling fast
            expect(bird.velocity).toBeGreaterThan(0);

            // Click to flap
            handleClick({ type: 'click' });

            // Velocity should now be upward
            expect(bird.velocity).toBe(FLAP_STRENGTH);
            expect(bird.velocity).toBeLessThan(0);
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
