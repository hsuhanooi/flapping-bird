/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F024: Create Game State Manager', () => {
    let gameJs;
    let gameState;
    let isPlaying;
    let isGameOver;
    let isStart;

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

        // Load game.js file
        gameJs = fs.readFileSync(path.join(__dirname, '..', 'game.js'), 'utf8');
        
        // Extract gameState variable and helper functions
        // Extract gameState declaration
        const gameStateMatch = gameJs.match(/let\s+gameState\s*=\s*['"](start|playing|gameover)['"]/);
        if (!gameStateMatch) {
            throw new Error('gameState variable not found in game.js');
        }
        
        // Extract helper functions
        const isStartMatch = gameJs.match(/function\s+isStart\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
        const isPlayingMatch = gameJs.match(/function\s+isPlaying\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
        const isGameOverMatch = gameJs.match(/function\s+isGameOver\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
        
        if (!isStartMatch || !isPlayingMatch || !isGameOverMatch) {
            throw new Error('Helper functions not found in game.js');
        }
        
        // Create a script that defines gameState and helper functions
        const script = new Function(`
            let gameState = '${gameStateMatch[1]}';
            ${isStartMatch[0]}
            ${isPlayingMatch[0]}
            ${isGameOverMatch[0]}
            return { gameState, isStart, isPlaying, isGameOver };
        `);
        
        const result = script();
        gameState = result.gameState;
        isStart = result.isStart;
        isPlaying = result.isPlaying;
        isGameOver = result.isGameOver;
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('gameState variable exists', () => {
        test('gameState variable is defined in code', () => {
            expect(gameJs).toMatch(/let\s+gameState\s*=/);
        });

        test('gameState is initialized to start', () => {
            expect(gameJs).toMatch(/let\s+gameState\s*=\s*['"]start['"]/);
        });

        test('gameState variable has correct initial value', () => {
            expect(gameState).toBe('start');
        });
    });

    describe('All three states are defined', () => {
        test('start state is defined in code', () => {
            expect(gameJs).toMatch(/['"]start['"]/);
        });

        test('playing state is defined in code', () => {
            expect(gameJs).toMatch(/['"]playing['"]/);
        });

        test('gameover state is defined in code', () => {
            expect(gameJs).toMatch(/['"]gameover['"]/);
        });

        test('All three states appear in helper functions', () => {
            // Check that all three states are referenced in the helper functions
            expect(gameJs).toMatch(/gameState\s*===\s*['"]start['"]/);
            expect(gameJs).toMatch(/gameState\s*===\s*['"]playing['"]/);
            expect(gameJs).toMatch(/gameState\s*===\s*['"]gameover['"]/);
        });
    });

    describe('Helper functions return correct values', () => {
        test('isStart() function exists', () => {
            expect(typeof isStart).toBe('function');
        });

        test('isPlaying() function exists', () => {
            expect(typeof isPlaying).toBe('function');
        });

        test('isGameOver() function exists', () => {
            expect(typeof isGameOver).toBe('function');
        });

        test('isStart() returns true when gameState is start', () => {
            // gameState is initialized to 'start'
            expect(isStart()).toBe(true);
        });

        test('isPlaying() returns false when gameState is start', () => {
            // gameState is initialized to 'start'
            expect(isPlaying()).toBe(false);
        });

        test('isGameOver() returns false when gameState is start', () => {
            // gameState is initialized to 'start'
            expect(isGameOver()).toBe(false);
        });

        test('Helper functions return boolean values', () => {
            expect(typeof isStart()).toBe('boolean');
            expect(typeof isPlaying()).toBe('boolean');
            expect(typeof isGameOver()).toBe('boolean');
        });

        test('Only one helper function returns true at a time (start state)', () => {
            const start = isStart();
            const playing = isPlaying();
            const gameover = isGameOver();
            
            // In start state, only isStart() should be true
            expect(start).toBe(true);
            expect(playing).toBe(false);
            expect(gameover).toBe(false);
        });
    });

    describe('Helper function implementation', () => {
        test('isStart() function is defined in code', () => {
            expect(gameJs).toMatch(/function\s+isStart\s*\(/);
        });

        test('isPlaying() function is defined in code', () => {
            expect(gameJs).toMatch(/function\s+isPlaying\s*\(/);
        });

        test('isGameOver() function is defined in code', () => {
            expect(gameJs).toMatch(/function\s+isGameOver\s*\(/);
        });

        test('isStart() checks gameState === "start"', () => {
            expect(gameJs).toMatch(/return\s+gameState\s*===\s*['"]start['"]/);
        });

        test('isPlaying() checks gameState === "playing"', () => {
            expect(gameJs).toMatch(/return\s+gameState\s*===\s*['"]playing['"]/);
        });

        test('isGameOver() checks gameState === "gameover"', () => {
            expect(gameJs).toMatch(/return\s+gameState\s*===\s*['"]gameover['"]/);
        });
    });
});
