/**
 * @jest-environment jsdom
 */

/**
 * Tests for F025: Implement Start State Behavior
 * 
 * Tests that:
 * - Bird stays stationary in start state (no gravity)
 * - Pipes do not spawn or move in start state
 * - Game logic only runs when state is 'playing'
 * - Frame counter does not increment in start state
 */

const fs = require('fs');
const path = require('path');

describe('F025: Start State Behavior', () => {
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
            font: '',
            textAlign: '',
            textBaseline: '',
            fillText: jest.fn(),
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

        // Mock requestAnimationFrame
        global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
        global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('update function checks game state', () => {
        test('update function checks isPlaying before running game logic', () => {
            expect(gameJs).toMatch(/if\s*\(\s*!isPlaying\s*\(\s*\)\s*\)/);
        });

        test('update function returns early when not playing', () => {
            expect(gameJs).toMatch(/return[\s\S]*Don't update game logic in start or gameover states/);
        });
    });

    describe('Bird stays stationary in start state', () => {
        test('bird does not fall in start state', () => {
            // Execute game.js with start state
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                const initialY = bird.y;
                const initialVelocity = bird.velocity;
                
                // Run update multiple times
                for (let i = 0; i < 10; i++) {
                    update();
                }
                
                return {
                    finalY: bird.y,
                    finalVelocity: bird.velocity,
                    initialY,
                    initialVelocity
                };
            `);
            
            const result = script();
            
            // Bird should still be at initial position
            expect(result.finalY).toBe(result.initialY);
            expect(result.finalVelocity).toBe(result.initialVelocity);
        });

        test('bird does not move horizontally in start state', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                const initialX = bird.x;
                
                // Run update multiple times
                for (let i = 0; i < 10; i++) {
                    update();
                }
                
                return { finalX: bird.x, initialX };
            `);
            
            const result = script();
            
            // Bird x position should not change
            expect(result.finalX).toBe(result.initialX);
        });
    });

    describe('Pipes do not spawn in start state', () => {
        test('pipes array does not grow in start state', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                pipes.length = 0;  // Clear pipes
                const initialLength = pipes.length;
                
                // Run update many times (enough to trigger spawning if enabled)
                for (let i = 0; i < 200; i++) {
                    update();
                }
                
                return { finalLength: pipes.length, initialLength };
            `);
            
            const result = script();
            
            // Pipes array should still be empty
            expect(result.finalLength).toBe(result.initialLength);
            expect(result.finalLength).toBe(0);
        });
    });

    describe('Pipes do not move in start state', () => {
        test('existing pipes do not move in start state', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                pipes.length = 0;
                
                // Manually add a pipe
                pipes.push({
                    x: 300,
                    topHeight: 100,
                    bottomY: 220,
                    passed: false
                });
                
                const initialPipeX = pipes[0].x;
                
                // Run update multiple times
                for (let i = 0; i < 10; i++) {
                    update();
                }
                
                return { finalPipeX: pipes[0].x, initialPipeX };
            `);
            
            const result = script();
            
            // Pipe x position should not have changed
            expect(result.finalPipeX).toBe(result.initialPipeX);
        });
    });

    describe('Frame counter does not increment in start state', () => {
        test('frameCount does not change in start state', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                const initialFrameCount = frameCount;
                
                // Run update multiple times
                for (let i = 0; i < 10; i++) {
                    update();
                }
                
                return { finalFrameCount: frameCount, initialFrameCount };
            `);
            
            const result = script();
            
            // Frame count should not have changed
            expect(result.finalFrameCount).toBe(result.initialFrameCount);
        });
    });

    describe('Game logic only runs when state is playing', () => {
        test('update returns early when state is start', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                const initialFrameCount = frameCount;
                update();
                return frameCount;
            `);
            
            const finalFrameCount = script();
            
            // Frame count should not have incremented
            expect(finalFrameCount).toBe(0);
        });

        test('update runs game logic when state is playing', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'playing';
                initBird();
                const initialFrameCount = frameCount;
                update();
                return frameCount;
            `);
            
            const finalFrameCount = script();
            
            // Frame count should have incremented
            expect(finalFrameCount).toBe(1);
        });

        test('update returns early when state is gameover', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                initBird();
                const initialFrameCount = frameCount;
                update();
                return frameCount;
            `);
            
            const finalFrameCount = script();
            
            // Frame count should not have incremented
            expect(finalFrameCount).toBe(0);
        });
    });

    describe('Collision detection does not run in start state', () => {
        test('checkPipeCollisions is not called in start state', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                gameOver = false;
                
                // Manually add a pipe that would collide with bird
                pipes.push({
                    x: bird.x,
                    topHeight: bird.y + bird.height + 10,
                    bottomY: bird.y + bird.height + 10 + 120,
                    passed: false
                });
                
                update();
                return gameOver;
            `);
            
            const gameOverResult = script();
            
            // gameOver should still be false (collision check didn't run)
            expect(gameOverResult).toBe(false);
        });
    });

    describe('Bird hovers at starting position', () => {
        test('bird maintains initial position in start state', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'start';
                initBird();
                const expectedY = CANVAS_HEIGHT / 2;
                
                // Run update multiple times
                for (let i = 0; i < 20; i++) {
                    update();
                }
                
                return {
                    finalY: bird.y,
                    expectedY,
                    finalX: bird.x
                };
            `);
            
            const result = script();
            
            // Bird should still be at starting position
            expect(result.finalY).toBe(result.expectedY);
            expect(result.finalX).toBe(80);  // Initial x position
        });
    });
});
