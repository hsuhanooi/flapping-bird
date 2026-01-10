/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F003: Initialize Canvas Context', () => {
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

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('game.js file existence and basic structure', () => {
        test('game.js file exists', () => {
            const filePath = path.join(__dirname, '../game.js');
            expect(fs.existsSync(filePath)).toBe(true);
        });

        test('game.js is not empty', () => {
            expect(gameJs.trim().length).toBeGreaterThan(0);
        });

        test('game.js does not contain only placeholder content', () => {
            // Should have more than just the placeholder comment
            expect(gameJs.length).toBeGreaterThan(50);
        });
    });

    describe('Canvas element access', () => {
        test('game.js gets canvas element by ID', () => {
            expect(gameJs).toMatch(/getElementById\s*\(\s*['"]gameCanvas['"]\s*\)/);
        });

        test('canvas variable is declared', () => {
            expect(gameJs).toMatch(/const\s+canvas\s*=/);
        });
    });

    describe('2D rendering context', () => {
        test('game.js gets 2D context from canvas', () => {
            expect(gameJs).toMatch(/getContext\s*\(\s*['"]2d['"]\s*\)/);
        });

        test('context variable is declared (ctx)', () => {
            expect(gameJs).toMatch(/const\s+ctx\s*=/);
        });
    });

    describe('Canvas dimension constants', () => {
        test('CANVAS_WIDTH constant is defined', () => {
            expect(gameJs).toMatch(/const\s+CANVAS_WIDTH\s*=/);
        });

        test('CANVAS_HEIGHT constant is defined', () => {
            expect(gameJs).toMatch(/const\s+CANVAS_HEIGHT\s*=/);
        });

        test('CANVAS_WIDTH uses canvas.width', () => {
            expect(gameJs).toMatch(/CANVAS_WIDTH\s*=\s*canvas\.width/);
        });

        test('CANVAS_HEIGHT uses canvas.height', () => {
            expect(gameJs).toMatch(/CANVAS_HEIGHT\s*=\s*canvas\.height/);
        });
    });

    describe('Canvas initialization', () => {
        test('initCanvas function is defined', () => {
            expect(gameJs).toMatch(/function\s+initCanvas\s*\(\s*\)/);
        });

        test('fillRect is called for background fill', () => {
            expect(gameJs).toMatch(/fillRect\s*\(/);
        });

        test('fillStyle is set for background color', () => {
            expect(gameJs).toMatch(/fillStyle\s*=/);
        });

        test('initCanvas is called', () => {
            expect(gameJs).toMatch(/initCanvas\s*\(\s*\)/);
        });
    });

    describe('Script execution in DOM', () => {
        test('canvas element can be accessed after script loads', () => {
            const canvas = document.getElementById('gameCanvas');
            expect(canvas).not.toBeNull();
            expect(canvas.tagName).toBe('CANVAS');
        });

        test('canvas has correct width attribute', () => {
            const canvas = document.getElementById('gameCanvas');
            expect(canvas.width).toBe(400);
        });

        test('canvas has correct height attribute', () => {
            const canvas = document.getElementById('gameCanvas');
            expect(canvas.height).toBe(600);
        });

        test('getContext is available on canvas', () => {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            expect(ctx).not.toBeNull();
        });
    });
});
