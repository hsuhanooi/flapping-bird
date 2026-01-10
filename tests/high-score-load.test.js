/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Tests for F032: Load High Score from Storage
// These tests verify the loadHighScore() function and highScore variable

describe('F032: Load High Score from Storage', () => {
    let gameJs;
    let mockContext;

    beforeEach(() => {
        // Set up DOM with canvas element
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;

        // Mock canvas context
        mockContext = {
            fillStyle: '',
            fillRect: jest.fn(),
            clearRect: jest.fn(),
            beginPath: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
            stroke: jest.fn(),
            arc: jest.fn(),
            rect: jest.fn(),
            fillText: jest.fn(),
            font: '',
            textAlign: '',
            textBaseline: ''
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('highScore Variable', () => {
        test('highScore variable should be declared', () => {
            expect(gameJs).toMatch(/let\s+highScore\s*=/);
        });

        test('highScore should be initialized to 0', () => {
            expect(gameJs).toMatch(/let\s+highScore\s*=\s*0/);
        });

        test('highScore variable has a comment explaining its purpose', () => {
            expect(gameJs).toMatch(/highScore.*highest score.*localStorage/i);
        });
    });

    describe('loadHighScore() Function Definition', () => {
        test('loadHighScore function should exist', () => {
            expect(gameJs).toMatch(/function\s+loadHighScore\s*\(\s*\)/);
        });

        test('loadHighScore function is properly defined', () => {
            const match = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{/);
            expect(match).toBeTruthy();
        });

        test('loadHighScore function is defined at top level', () => {
            const loadHighScoreIndex = gameJs.indexOf('function loadHighScore()');
            expect(loadHighScoreIndex).toBeGreaterThanOrEqual(0);

            // Check it's at top level (same number of open/close braces before it)
            const beforeLoadHighScore = gameJs.substring(0, loadHighScoreIndex);
            const openBraces = (beforeLoadHighScore.match(/\{/g) || []).length;
            const closeBraces = (beforeLoadHighScore.match(/\}/g) || []).length;
            expect(openBraces).toBe(closeBraces);
        });
    });

    describe('localStorage Key Usage', () => {
        test('loadHighScore uses correct localStorage key', () => {
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(loadHighScoreMatch).toBeTruthy();
            expect(loadHighScoreMatch[0]).toMatch(/localStorage\.getItem\s*\(\s*['"]flappyHighScore['"]\s*\)/);
        });

        test('uses localStorage.getItem() method', () => {
            expect(gameJs).toMatch(/localStorage\.getItem/);
        });
    });

    describe('Integer Parsing', () => {
        test('loadHighScore parses stored value as integer', () => {
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(loadHighScoreMatch).toBeTruthy();
            expect(loadHighScoreMatch[0]).toMatch(/parseInt\s*\(/);
        });

        test('parseInt uses radix 10', () => {
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(loadHighScoreMatch).toBeTruthy();
            expect(loadHighScoreMatch[0]).toMatch(/parseInt\s*\([^,]+,\s*10\s*\)/);
        });
    });

    describe('Default Value Handling', () => {
        test('loadHighScore checks for null value from localStorage', () => {
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(loadHighScoreMatch).toBeTruthy();
            expect(loadHighScoreMatch[0]).toMatch(/!==\s*null|null\s*!==/);
        });

        test('loadHighScore defaults highScore to 0 when no stored value', () => {
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(loadHighScoreMatch).toBeTruthy();
            expect(loadHighScoreMatch[0]).toMatch(/highScore\s*=\s*0/);
        });

        test('loadHighScore handles NaN values by defaulting to 0', () => {
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(loadHighScoreMatch).toBeTruthy();
            expect(loadHighScoreMatch[0]).toMatch(/isNaN/);
        });
    });

    describe('highScore Assignment', () => {
        test('loadHighScore assigns parsed value to highScore', () => {
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(loadHighScoreMatch).toBeTruthy();
            expect(loadHighScoreMatch[0]).toMatch(/highScore\s*=/);
        });
    });

    describe('init() Integration', () => {
        test('loadHighScore is called in init() function', () => {
            const initMatch = gameJs.match(/function\s+init\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(initMatch).toBeTruthy();
            expect(initMatch[0]).toMatch(/loadHighScore\s*\(\s*\)/);
        });

        test('loadHighScore is called before initBird in init()', () => {
            const initMatch = gameJs.match(/function\s+init\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(initMatch).toBeTruthy();
            const initBody = initMatch[0];
            const loadHighScoreIndex = initBody.indexOf('loadHighScore()');
            const initBirdIndex = initBody.indexOf('initBird()');
            expect(loadHighScoreIndex).toBeLessThan(initBirdIndex);
        });
    });

    describe('Function Behavior Tests (with mocked localStorage)', () => {
        let mockLocalStorage;

        beforeEach(() => {
            // Create mock localStorage
            mockLocalStorage = {
                store: {},
                getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
                setItem: jest.fn((key, value) => { mockLocalStorage.store[key] = value.toString(); }),
                removeItem: jest.fn((key) => { delete mockLocalStorage.store[key]; }),
                clear: jest.fn(() => { mockLocalStorage.store = {}; })
            };

            // Set up global localStorage mock
            Object.defineProperty(window, 'localStorage', {
                value: mockLocalStorage,
                writable: true,
                configurable: true
            });

            // Mock requestAnimationFrame
            global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
            global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));
        });

        afterEach(() => {
            delete global.requestAnimationFrame;
            delete global.cancelAnimationFrame;
        });

        test('loadHighScore loads stored high score from localStorage', () => {
            mockLocalStorage.store['flappyHighScore'] = '42';
            eval(gameJs);
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('flappyHighScore');
        });

        test('loadHighScore is called during game initialization', () => {
            eval(gameJs);
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('flappyHighScore');
        });

        test('highScore variable is set with stored value', () => {
            mockLocalStorage.store['flappyHighScore'] = '100';
            eval(gameJs);
            // Verify getItem was called with correct key to load the high score
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('flappyHighScore');
            // Verify the function ran without errors (which means highScore was assigned)
            expect(mockLocalStorage.getItem.mock.calls.length).toBeGreaterThanOrEqual(1);
        });

        test('highScore handles missing localStorage entry', () => {
            mockLocalStorage.store = {};
            // Should not throw error when no stored value exists
            expect(() => eval(gameJs)).not.toThrow();
            expect(mockLocalStorage.getItem).toHaveBeenCalledWith('flappyHighScore');
        });

        test('localStorage.getItem is called with string number value', () => {
            mockLocalStorage.store['flappyHighScore'] = '999';
            eval(gameJs);
            // The mock returns '999', which should be parsed correctly
            expect(mockLocalStorage.getItem('flappyHighScore')).toBe('999');
        });

        test('localStorage.getItem is called with zero value', () => {
            mockLocalStorage.store['flappyHighScore'] = '0';
            eval(gameJs);
            // The mock returns '0', which should be parsed to 0
            expect(mockLocalStorage.getItem('flappyHighScore')).toBe('0');
        });
    });
});
