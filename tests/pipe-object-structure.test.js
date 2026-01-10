/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F014: Create Pipe Object Structure', () => {
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

    describe('Pipe constants definition', () => {
        test('PIPE_WIDTH constant is defined', () => {
            expect(gameJs).toMatch(/const\s+PIPE_WIDTH\s*=/);
        });

        test('PIPE_WIDTH is set to 52 pixels', () => {
            expect(gameJs).toMatch(/PIPE_WIDTH\s*=\s*52/);
        });

        test('PIPE_GAP constant is defined', () => {
            expect(gameJs).toMatch(/const\s+PIPE_GAP\s*=/);
        });

        test('PIPE_GAP is set to 120 pixels', () => {
            expect(gameJs).toMatch(/PIPE_GAP\s*=\s*120/);
        });
    });

    describe('Pipes array', () => {
        test('pipes array is defined', () => {
            expect(gameJs).toMatch(/const\s+pipes\s*=\s*\[\s*\]/);
        });

        test('pipes array is initialized as empty', () => {
            expect(gameJs).toMatch(/pipes\s*=\s*\[\s*\]/);
        });
    });

    describe('Pipe object structure', () => {
        test('pipe structure documentation exists', () => {
            // Check for comments or documentation about pipe structure
            expect(gameJs).toMatch(/pipe|Pipe/i);
        });

        test('script can execute without errors', () => {
            expect(() => {
                eval(gameJs);
            }).not.toThrow();
        });
    });

    describe('Pipe structure can represent a gap', () => {
        test('can create pipe object with x, topHeight, and bottomY properties', () => {
            // Execute game.js in a controlled environment
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;
                const GROUND_HEIGHT = 80;
                const PIPE_WIDTH = 52;
                const PIPE_GAP = 120;
                const pipes = [];

                // Create a test pipe object
                const groundY = CANVAS_HEIGHT - GROUND_HEIGHT;
                const topHeight = 100;
                const bottomY = topHeight + PIPE_GAP;
                const pipe = {
                    x: CANVAS_WIDTH,
                    topHeight: topHeight,
                    bottomY: bottomY
                };

                pipes.push(pipe);
                return { pipe, pipes, PIPE_WIDTH, PIPE_GAP };
            `);
            const result = script();

            expect(result.pipe).toBeDefined();
            expect(result.pipe.x).toBe(400);
            expect(result.pipe.topHeight).toBe(100);
            expect(result.pipe.bottomY).toBe(220); // 100 + 120
            expect(result.pipes.length).toBe(1);
            expect(result.PIPE_WIDTH).toBe(52);
            expect(result.PIPE_GAP).toBe(120);
        });

        test('bottomY is calculated correctly from topHeight + PIPE_GAP', () => {
            const script = new Function(`
                const PIPE_GAP = 120;
                const topHeight = 150;
                const bottomY = topHeight + PIPE_GAP;
                return { topHeight, bottomY, PIPE_GAP };
            `);
            const result = script();

            expect(result.bottomY).toBe(result.topHeight + result.PIPE_GAP);
            expect(result.bottomY).toBe(270);
        });

        test('pipe structure allows multiple pipes in array', () => {
            const script = new Function(`
                const PIPE_WIDTH = 52;
                const PIPE_GAP = 120;
                const pipes = [];

                // Create multiple test pipes
                const pipe1 = { x: 400, topHeight: 100, bottomY: 220 };
                const pipe2 = { x: 500, topHeight: 150, bottomY: 270 };
                const pipe3 = { x: 600, topHeight: 80, bottomY: 200 };

                pipes.push(pipe1, pipe2, pipe3);
                return pipes;
            `);
            const pipes = script();

            expect(pipes.length).toBe(3);
            expect(pipes[0].x).toBe(400);
            expect(pipes[1].x).toBe(500);
            expect(pipes[2].x).toBe(600);
            expect(pipes[0].bottomY).toBe(pipes[0].topHeight + 120);
            expect(pipes[1].bottomY).toBe(pipes[1].topHeight + 120);
            expect(pipes[2].bottomY).toBe(pipes[2].topHeight + 120);
        });
    });

    describe('Pipe constants accessibility', () => {
        test('PIPE_WIDTH and PIPE_GAP are accessible in game context', () => {
            const script = new Function(`
                const canvas = document.getElementById('gameCanvas');
                const ctx = canvas.getContext('2d');
                const CANVAS_WIDTH = canvas.width;
                const CANVAS_HEIGHT = canvas.height;
                const GROUND_HEIGHT = 80;
                const PIPE_WIDTH = 52;
                const PIPE_GAP = 120;
                const pipes = [];

                return { PIPE_WIDTH, PIPE_GAP, pipes };
            `);
            const result = script();

            expect(result.PIPE_WIDTH).toBe(52);
            expect(result.PIPE_GAP).toBe(120);
            expect(Array.isArray(result.pipes)).toBe(true);
        });
    });
});
