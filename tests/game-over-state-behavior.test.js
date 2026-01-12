/**
 * @jest-environment jsdom
 */

/**
 * Tests for F028: Implement Game Over State Behavior
 * 
 * Tests that:
 * - Game state transitions to 'gameover' when collisions are detected
 * - Bird physics updates stop in gameover state
 * - Pipe movement stops in gameover state
 * - Scene remains visible (frozen) in gameover state
 */

const fs = require('fs');
const path = require('path');

describe('F028: Game Over State Behavior', () => {
    let gameJs;

    beforeEach(() => {
        // Set up DOM with canvas
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;

        // Mock canvas context
        const mockGradient = {
            addColorStop: jest.fn(),
        };
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
            createLinearGradient: jest.fn(() => mockGradient),
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

    describe('Game state transitions to gameover on collision', () => {
        test('should set gameState to gameover on ground collision', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'playing';
                gameOver = false;
                initBird();
                
                // Position bird at ground collision threshold
                bird.y = CANVAS_HEIGHT - GROUND_HEIGHT - bird.height;
                
                // Call updateBird which should detect collision
                updateBird();
                
                return gameState;
            `);
            
            const result = script();
            
            // Check that gameState is 'gameover'
            expect(result).toBe('gameover');
        });

        test('should set gameState to gameover on ceiling collision', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'playing';
                gameOver = false;
                initBird();
                
                // Position bird at ceiling
                bird.y = -1; // Above top of canvas
                
                // Call updateBird which should detect collision
                updateBird();
                
                return gameState;
            `);
            
            const result = script();
            
            // Check that gameState is 'gameover'
            expect(result).toBe('gameover');
        });

        test('should set gameState to gameover on pipe collision', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'playing';
                gameOver = false;
                initBird();
                pipes.length = 0;
                
                // Create a pipe that bird will collide with
                pipes.push({
                    x: bird.x,
                    topHeight: 100,
                    bottomY: 220,
                    passed: false
                });
                
                // Position bird to collide with top pipe
                bird.y = 50; // Within top pipe height
                
                // Call checkPipeCollisions which should detect collision
                checkPipeCollisions();
                
                return gameState;
            `);
            
            const result = script();
            
            // Check that gameState is 'gameover'
            expect(result).toBe('gameover');
        });
    });

    describe('Bird physics updates stop in gameover state', () => {
        test('should not update bird position when gameState is gameover', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                
                // Record initial bird position
                const initialY = bird.y;
                const initialVelocity = bird.velocity;
                
                // Call updateBird multiple times
                updateBird();
                updateBird();
                updateBird();
                
                return {
                    finalY: bird.y,
                    finalVelocity: bird.velocity,
                    initialY,
                    initialVelocity
                };
            `);
            
            const result = script();
            
            // Bird position and velocity should not change
            expect(result.finalY).toBe(result.initialY);
            expect(result.finalVelocity).toBe(result.initialVelocity);
        });

        test('should not apply gravity when gameState is gameover', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                
                // Set initial velocity
                bird.velocity = 5;
                const initialVelocity = bird.velocity;
                
                // Call updateBird multiple times
                updateBird();
                updateBird();
                updateBird();
                
                return {
                    finalVelocity: bird.velocity,
                    initialVelocity
                };
            `);
            
            const result = script();
            
            // Velocity should not change (no gravity applied)
            expect(result.finalVelocity).toBe(result.initialVelocity);
        });
    });

    describe('Pipe movement stops in gameover state', () => {
        test('should not move pipes when gameState is gameover', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                pipes.length = 0;
                
                // Create a pipe
                pipes.push({
                    x: 200,
                    topHeight: 100,
                    bottomY: 220,
                    passed: false
                });
                
                const initialX = pipes[0].x;
                
                // Call updatePipes multiple times
                updatePipes();
                updatePipes();
                updatePipes();
                
                return {
                    finalX: pipes[0].x,
                    initialX
                };
            `);
            
            const result = script();
            
            // Pipe position should not change
            expect(result.finalX).toBe(result.initialX);
        });

        test('should not spawn new pipes when gameState is gameover', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                pipes.length = 0;
                const initialPipeCount = pipes.length;
                
                // Set frameCount to trigger pipe spawn
                frameCount = 90; // Multiple of PIPE_SPAWN_INTERVAL
                
                // Call updatePipes
                updatePipes();
                
                return {
                    finalLength: pipes.length,
                    initialLength: initialPipeCount
                };
            `);
            
            const result = script();
            
            // No new pipes should be spawned
            expect(result.finalLength).toBe(result.initialLength);
            expect(result.finalLength).toBe(0);
        });
    });

    describe('Update function stops running in gameover state', () => {
        test('should not run game logic when gameState is gameover', () => {
            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                
                // Record initial state
                const initialBirdY = bird.y;
                const initialFrameCount = frameCount;
                
                // Create a pipe
                pipes.length = 0;
                pipes.push({
                    x: 200,
                    topHeight: 100,
                    bottomY: 220,
                    passed: false
                });
                const initialPipeX = pipes[0].x;
                
                // Call update (which should return early)
                update();
                update();
                update();
                
                return {
                    finalBirdY: bird.y,
                    finalPipeX: pipes[0].x,
                    finalFrameCount: frameCount,
                    initialBirdY,
                    initialPipeX,
                    initialFrameCount
                };
            `);
            
            const result = script();
            
            // Nothing should change
            expect(result.finalBirdY).toBe(result.initialBirdY);
            expect(result.finalPipeX).toBe(result.initialPipeX);
            expect(result.finalFrameCount).toBe(result.initialFrameCount);
        });
    });

    describe('Scene remains visible in gameover state', () => {
        test('should render game elements when gameState is gameover', () => {
            const mockGradient = {
                addColorStop: jest.fn(),
            };
            const mockContext = {
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 0,
                fillRect: jest.fn(),
                clearRect: jest.fn(),
                beginPath: jest.fn(),
                closePath: jest.fn(),
                fill: jest.fn(),
                stroke: jest.fn(),
                arc: jest.fn(),
                rect: jest.fn(),
                ellipse: jest.fn(),
                moveTo: jest.fn(),
                lineTo: jest.fn(),
                font: '',
                textAlign: '',
                textBaseline: '',
                fillText: jest.fn(),
                save: jest.fn(),
                restore: jest.fn(),
                translate: jest.fn(),
                rotate: jest.fn(),
                createLinearGradient: jest.fn(() => mockGradient),
            };

            HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                pipes.length = 0;
                
                // Create a pipe
                pipes.push({
                    x: 200,
                    topHeight: 100,
                    bottomY: 220,
                    passed: false
                });
                
                // Position bird
                bird.x = 80;
                bird.y = 300;
                
                // Call render
                render();
                
                return {
                    fillRectCalled: true,
                    clearRectCalled: true
                };
            `);
            
            script();
            
            // Should clear canvas
            expect(mockContext.clearRect).toHaveBeenCalled();
            
            // Should render background and other elements (fillRect called)
            expect(mockContext.fillRect).toHaveBeenCalled();
        });

        test('should render pipes when gameState is gameover', () => {
            const mockGradient = {
                addColorStop: jest.fn(),
            };
            const mockContext = {
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 0,
                fillRect: jest.fn(),
                clearRect: jest.fn(),
                beginPath: jest.fn(),
                closePath: jest.fn(),
                fill: jest.fn(),
                stroke: jest.fn(),
                arc: jest.fn(),
                rect: jest.fn(),
                ellipse: jest.fn(),
                moveTo: jest.fn(),
                lineTo: jest.fn(),
                font: '',
                textAlign: '',
                textBaseline: '',
                fillText: jest.fn(),
                save: jest.fn(),
                restore: jest.fn(),
                translate: jest.fn(),
                rotate: jest.fn(),
                createLinearGradient: jest.fn(() => mockGradient),
            };

            HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                pipes.length = 0;
                
                // Create a pipe
                pipes.push({
                    x: 200,
                    topHeight: 100,
                    bottomY: 220,
                    passed: false
                });
                
                // Call render
                render();
            `);
            
            script();
            
            // Should render pipes (fillRect called for pipes)
            // Check that fillRect was called with pipe x position
            const fillRectCalls = mockContext.fillRect.mock.calls;
            const pipeRendered = fillRectCalls.some(call => call[0] === 200);
            expect(pipeRendered).toBe(true);
        });

        test('should render score when gameState is gameover', () => {
            const mockGradient = {
                addColorStop: jest.fn(),
            };
            const mockContext = {
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 0,
                fillRect: jest.fn(),
                clearRect: jest.fn(),
                beginPath: jest.fn(),
                closePath: jest.fn(),
                fill: jest.fn(),
                stroke: jest.fn(),
                arc: jest.fn(),
                rect: jest.fn(),
                ellipse: jest.fn(),
                moveTo: jest.fn(),
                lineTo: jest.fn(),
                font: '',
                textAlign: '',
                textBaseline: '',
                fillText: jest.fn(),
                save: jest.fn(),
                restore: jest.fn(),
                translate: jest.fn(),
                rotate: jest.fn(),
                createLinearGradient: jest.fn(() => mockGradient),
            };

            HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

            const script = new Function(`
                ${gameJs}
                gameState = 'gameover';
                gameOver = true;
                initBird();
                score = 5;
                
                // Call render
                render();
            `);
            
            script();
            
            // Should render score (fillText called with score)
            expect(mockContext.fillText).toHaveBeenCalled();
            const fillTextCalls = mockContext.fillText.mock.calls;
            const scoreRendered = fillTextCalls.some(call => 
                call[0] === '5' || call[0] === 5
            );
            expect(scoreRendered).toBe(true);
        });
    });
});
