/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F019: Create Collision Detection Function', () => {
    let gameJs;
    let checkCollision;

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
        
        // Extract and execute just the checkCollision function
        const checkCollisionMatch = gameJs.match(/function\s+checkCollision\s*\([^)]*\)\s*\{[\s\S]*?\n\}/);
        if (!checkCollisionMatch) {
            throw new Error('checkCollision function not found in game.js');
        }
        
        // Create a function that defines checkCollision and returns it
        const script = new Function(`
            ${checkCollisionMatch[0]}
            return checkCollision;
        `);
        
        checkCollision = script();
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    test('checkCollision function exists', () => {
        expect(typeof checkCollision).toBe('function');
    });

    test('checkCollision accepts two rectangle objects', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 5, y: 5, width: 10, height: 10 };
        
        expect(() => checkCollision(rect1, rect2)).not.toThrow();
    });

    test('checkCollision returns true for overlapping rectangles', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 5, y: 5, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision returns false for non-overlapping rectangles (side by side)', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 15, y: 0, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(false);
    });

    test('checkCollision returns false for non-overlapping rectangles (stacked vertically)', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 0, y: 15, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(false);
    });

    test('checkCollision returns true for rectangles that are completely overlapping', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 0, y: 0, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision returns true for rectangles where one contains the other', () => {
        const rect1 = { x: 0, y: 0, width: 20, height: 20 };
        const rect2 = { x: 5, y: 5, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision returns true for rectangles touching at edges', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 10, y: 0, width: 10, height: 10 };
        
        // AABB considers touching edges as overlapping
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision returns true for rectangles touching at corners', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 10, y: 10, width: 10, height: 10 };
        
        // AABB considers touching corners as overlapping
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision returns false for rectangles with gap between them', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 11, y: 0, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(false);
    });

    test('checkCollision works with rectangles at different positions', () => {
        const rect1 = { x: 50, y: 100, width: 30, height: 40 };
        const rect2 = { x: 60, y: 120, width: 20, height: 15 };
        
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision works with negative positions', () => {
        const rect1 = { x: -5, y: -5, width: 10, height: 10 };
        const rect2 = { x: 0, y: 0, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision handles rectangles with zero width', () => {
        const rect1 = { x: 0, y: 0, width: 0, height: 10 };
        const rect2 = { x: 0, y: 0, width: 10, height: 10 };
        
        // Zero-width rectangles at same position should overlap
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision handles rectangles with zero height', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 0 };
        const rect2 = { x: 0, y: 0, width: 10, height: 10 };
        
        // Zero-height rectangles at same position should overlap
        expect(checkCollision(rect1, rect2)).toBe(true);
    });

    test('checkCollision is commutative (order of arguments does not matter)', () => {
        const rect1 = { x: 0, y: 0, width: 10, height: 10 };
        const rect2 = { x: 5, y: 5, width: 10, height: 10 };
        
        expect(checkCollision(rect1, rect2)).toBe(checkCollision(rect2, rect1));
    });

    test('checkCollision works with bird-like rectangle dimensions', () => {
        const bird = { x: 80, y: 300, width: 34, height: 24 };
        const pipe = { x: 100, y: 0, width: 52, height: 150 };
        
        // Bird: x=80-114, y=300-324
        // Pipe: x=100-152, y=0-150
        // They overlap horizontally (100-114) and vertically (300 overlaps with 0-150)
        // Actually, bird y=300 is below pipe bottom y=150, so no overlap
        expect(checkCollision(bird, pipe)).toBe(false);
    });

    test('checkCollision works when bird is above pipe', () => {
        const bird = { x: 100, y: 50, width: 34, height: 24 };
        const pipe = { x: 100, y: 0, width: 52, height: 50 };
        
        // Bird: x=100-134, y=50-74
        // Pipe: x=100-152, y=0-50
        // They overlap horizontally (100-134) and vertically (bird y=50-74 overlaps with pipe y=0-50)
        expect(checkCollision(bird, pipe)).toBe(true);
    });

    test('checkCollision works when bird is below pipe', () => {
        const bird = { x: 100, y: 200, width: 34, height: 24 };
        const pipe = { x: 100, y: 150, width: 52, height: 100 };
        
        // Bird top edge (200) overlaps with pipe bottom edge (250)
        expect(checkCollision(bird, pipe)).toBe(true);
    });

    test('checkCollision returns false when bird is to the left of pipe', () => {
        const bird = { x: 50, y: 100, width: 34, height: 24 };
        const pipe = { x: 100, y: 100, width: 52, height: 100 };
        
        expect(checkCollision(bird, pipe)).toBe(false);
    });

    test('checkCollision returns false when bird is to the right of pipe', () => {
        const bird = { x: 200, y: 100, width: 34, height: 24 };
        const pipe = { x: 100, y: 100, width: 52, height: 100 };
        
        expect(checkCollision(bird, pipe)).toBe(false);
    });

    test('checkCollision returns false when bird is above pipe with gap', () => {
        const bird = { x: 100, y: 50, width: 34, height: 24 };
        const pipe = { x: 100, y: 100, width: 52, height: 100 };
        
        // Bird bottom (74) is less than pipe top (100), so no overlap
        expect(checkCollision(bird, pipe)).toBe(false);
    });

    test('checkCollision returns false when bird is below pipe with gap', () => {
        const bird = { x: 100, y: 250, width: 34, height: 24 };
        const pipe = { x: 100, y: 0, width: 52, height: 100 };
        
        // Bird top (250) is greater than pipe bottom (100), so no overlap
        expect(checkCollision(bird, pipe)).toBe(false);
    });
});
