/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F004: Game Loop', () => {
    let gameJs;

    beforeEach(() => {
        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    describe('Game Loop Functions Exist', () => {
        test('game.js should define gameLoop function', () => {
            expect(gameJs).toMatch(/function\s+gameLoop\s*\(\s*\)/);
        });

        test('game.js should define update function', () => {
            expect(gameJs).toMatch(/function\s+update\s*\(\s*\)/);
        });

        test('game.js should define render function', () => {
            expect(gameJs).toMatch(/function\s+render\s*\(\s*\)/);
        });

        test('game.js should define startGameLoop function', () => {
            expect(gameJs).toMatch(/function\s+startGameLoop\s*\(\s*\)/);
        });

        test('game.js should define stopGameLoop function', () => {
            expect(gameJs).toMatch(/function\s+stopGameLoop\s*\(\s*\)/);
        });

        test('game.js should define clearCanvas function', () => {
            expect(gameJs).toMatch(/function\s+clearCanvas\s*\(\s*\)/);
        });

        test('game.js should define init function', () => {
            expect(gameJs).toMatch(/function\s+init\s*\(\s*\)/);
        });

        test('game.js should define drawBackground function', () => {
            expect(gameJs).toMatch(/function\s+drawBackground\s*\(\s*\)/);
        });
    });

    describe('Game Loop Uses requestAnimationFrame', () => {
        test('gameLoop should call requestAnimationFrame', () => {
            expect(gameJs).toMatch(/requestAnimationFrame\s*\(\s*gameLoop\s*\)/);
        });

        test('startGameLoop should call requestAnimationFrame', () => {
            expect(gameJs).toMatch(/animationFrameId\s*=\s*requestAnimationFrame\s*\(\s*gameLoop\s*\)/);
        });

        test('stopGameLoop should call cancelAnimationFrame', () => {
            expect(gameJs).toMatch(/cancelAnimationFrame\s*\(\s*animationFrameId\s*\)/);
        });
    });

    describe('Game Loop State Variables', () => {
        test('isGameLoopRunning variable is declared', () => {
            expect(gameJs).toMatch(/let\s+isGameLoopRunning\s*=/);
        });

        test('animationFrameId variable is declared', () => {
            expect(gameJs).toMatch(/let\s+animationFrameId\s*=/);
        });

        test('isGameLoopRunning is initially false', () => {
            expect(gameJs).toMatch(/let\s+isGameLoopRunning\s*=\s*false/);
        });

        test('animationFrameId is initially null', () => {
            expect(gameJs).toMatch(/let\s+animationFrameId\s*=\s*null/);
        });
    });

    describe('Game Loop Calls Update and Render', () => {
        test('gameLoop should call update()', () => {
            // gameLoop should contain a call to update()
            const gameLoopMatch = gameJs.match(/function\s+gameLoop\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(gameLoopMatch).not.toBeNull();
            expect(gameLoopMatch[0]).toMatch(/update\s*\(\s*\)/);
        });

        test('gameLoop should call render()', () => {
            // gameLoop should contain a call to render()
            const gameLoopMatch = gameJs.match(/function\s+gameLoop\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(gameLoopMatch).not.toBeNull();
            expect(gameLoopMatch[0]).toMatch(/render\s*\(\s*\)/);
        });
    });

    describe('Canvas Clearing', () => {
        test('clearCanvas should use clearRect', () => {
            expect(gameJs).toMatch(/clearRect\s*\(/);
        });

        test('clearCanvas should clear full canvas dimensions', () => {
            expect(gameJs).toMatch(/clearRect\s*\(\s*0\s*,\s*0\s*,\s*CANVAS_WIDTH\s*,\s*CANVAS_HEIGHT\s*\)/);
        });

        test('render should call clearCanvas', () => {
            // Verify render function calls clearCanvas
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0]).toMatch(/clearCanvas\s*\(\s*\)/);
        });
    });

    describe('Background Rendering', () => {
        test('drawBackground should use createLinearGradient', () => {
            expect(gameJs).toMatch(/createLinearGradient/);
        });

        test('drawBackground should set fillStyle to gradient', () => {
            expect(gameJs).toMatch(/ctx\.fillStyle\s*=\s*gradient/);
        });

        test('drawBackground should use fillRect', () => {
            expect(gameJs).toMatch(/fillRect\s*\(\s*0\s*,\s*0\s*,\s*CANVAS_WIDTH\s*,\s*CANVAS_HEIGHT\s*\)/);
        });

        test('render should call drawBackground', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0]).toMatch(/drawBackground\s*\(\s*\)/);
        });
    });

    describe('Start and Stop Game Loop Logic', () => {
        test('startGameLoop checks if already running', () => {
            expect(gameJs).toMatch(/if\s*\(\s*!isGameLoopRunning\s*\)/);
        });

        test('startGameLoop sets isGameLoopRunning to true', () => {
            expect(gameJs).toMatch(/isGameLoopRunning\s*=\s*true/);
        });

        test('stopGameLoop checks if running before stopping', () => {
            expect(gameJs).toMatch(/if\s*\(\s*isGameLoopRunning\s*\)/);
        });

        test('stopGameLoop sets isGameLoopRunning to false', () => {
            expect(gameJs).toMatch(/isGameLoopRunning\s*=\s*false/);
        });

        test('stopGameLoop sets animationFrameId to null', () => {
            expect(gameJs).toMatch(/animationFrameId\s*=\s*null/);
        });
    });

    describe('Initialization', () => {
        test('init should call startGameLoop', () => {
            const initMatch = gameJs.match(/function\s+init\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(initMatch).not.toBeNull();
            expect(initMatch[0]).toMatch(/startGameLoop\s*\(\s*\)/);
        });

        test('init is called at script load', () => {
            // init() should be called at the end of the file
            expect(gameJs).toMatch(/init\s*\(\s*\)\s*;?\s*$/);
        });
    });

    describe('Canvas Dimensions', () => {
        test('CANVAS_WIDTH constant exists', () => {
            expect(gameJs).toMatch(/const\s+CANVAS_WIDTH\s*=/);
        });

        test('CANVAS_HEIGHT constant exists', () => {
            expect(gameJs).toMatch(/const\s+CANVAS_HEIGHT\s*=/);
        });
    });
});

describe('F004: Game Loop - Runtime Behavior', () => {
    let mockRequestAnimationFrame;
    let mockCancelAnimationFrame;
    let frameId = 0;

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = '';

        // Create canvas element
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 400;
        canvas.height = 600;
        document.body.appendChild(canvas);

        // Mock requestAnimationFrame
        frameId = 0;
        mockRequestAnimationFrame = jest.fn((callback) => {
            frameId++;
            return frameId;
        });
        mockCancelAnimationFrame = jest.fn();

        global.requestAnimationFrame = mockRequestAnimationFrame;
        global.cancelAnimationFrame = mockCancelAnimationFrame;

        // Reset module cache
        jest.resetModules();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('game loop starts automatically when script loads', () => {
        require('../game.js');
        // requestAnimationFrame should have been called at least once
        expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    test('requestAnimationFrame is called with gameLoop function', () => {
        require('../game.js');
        // First call should be with the gameLoop function
        expect(mockRequestAnimationFrame).toHaveBeenCalledWith(expect.any(Function));
    });

    test('canvas context methods are called during initialization', () => {
        const canvas = document.getElementById('gameCanvas');
        const mockGradient = {
            addColorStop: jest.fn(),
        };
        const mockCtx = {
            fillStyle: '',
            fillRect: jest.fn(),
            clearRect: jest.fn(),
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
        jest.spyOn(canvas, 'getContext').mockReturnValue(mockCtx);

        require('../game.js');

        // Simulate a frame by calling the callback
        const callback = mockRequestAnimationFrame.mock.calls[0][0];
        callback();

        // clearRect should be called for clearing canvas
        expect(mockCtx.clearRect).toHaveBeenCalled();
        // fillRect should be called for drawing background
        expect(mockCtx.fillRect).toHaveBeenCalled();
        // fillText should be called for drawing score
        expect(mockCtx.fillText).toHaveBeenCalled();
    });
});
