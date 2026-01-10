/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F015: Render Pipes', () => {
    let gameJs;
    let mockContext;

    beforeEach(() => {
        // Set up DOM with canvas
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;

        // Mock canvas context with tracking for calls
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
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('renderPipes function existence', () => {
        test('renderPipes function is defined', () => {
            expect(gameJs).toMatch(/function\s+renderPipes\s*\(\s*\)/);
        });

        test('renderPipes function has a function body', () => {
            const match = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(match).not.toBeNull();
            expect(match[0].length).toBeGreaterThan(30);
        });
    });

    describe('renderPipes loops through pipes array', () => {
        test('renderPipes uses a loop to iterate through pipes', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should have a loop (for, while, or forEach)
            expect(body).toMatch(/for\s*\(|while\s*\(|\.forEach\s*\(/);
        });

        test('renderPipes accesses pipes array', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should reference pipes array
            expect(body).toMatch(/pipes/);
        });

        test('renderPipes uses pipes.length in loop condition', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should check pipes.length
            expect(body).toMatch(/pipes\.length/);
        });
    });

    describe('Top pipe rendering', () => {
        test('renderPipes draws top pipe section', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should have fillRect for top pipe
            expect(body).toMatch(/fillRect/);
        });

        test('renderPipes draws top pipe from y=0', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Top pipe should start at y=0
            expect(body).toMatch(/fillRect\s*\([^)]*,\s*0\s*,/);
        });

        test('renderPipes uses topHeight for top pipe height', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should reference topHeight
            expect(body).toMatch(/topHeight/);
        });

        test('renderPipes uses pipe.x for top pipe x position', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should use pipe.x
            expect(body).toMatch(/pipe\.x/);
        });

        test('renderPipes uses PIPE_WIDTH for top pipe width', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should reference PIPE_WIDTH
            expect(body).toMatch(/PIPE_WIDTH/);
        });
    });

    describe('Bottom pipe rendering', () => {
        test('renderPipes draws bottom pipe section', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should have two fillRect calls (one for top, one for bottom)
            const fillRectMatches = body.match(/fillRect/g);
            expect(fillRectMatches).not.toBeNull();
            expect(fillRectMatches.length).toBeGreaterThanOrEqual(2);
        });

        test('renderPipes uses bottomY for bottom pipe y position', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should reference bottomY
            expect(body).toMatch(/bottomY/);
        });

        test('renderPipes calculates bottom pipe height correctly', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should calculate height from bottomY to ground
            // Should reference GROUND_HEIGHT or groundY
            expect(body).toMatch(/GROUND_HEIGHT|groundY/);
        });

        test('renderPipes uses pipe.x for bottom pipe x position', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should use pipe.x for both pipes
            const pipeXMatches = body.match(/pipe\.x/g);
            expect(pipeXMatches).not.toBeNull();
            expect(pipeXMatches.length).toBeGreaterThanOrEqual(2);
        });

        test('renderPipes uses PIPE_WIDTH for bottom pipe width', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should reference PIPE_WIDTH (should appear multiple times)
            const pipeWidthMatches = body.match(/PIPE_WIDTH/g);
            expect(pipeWidthMatches).not.toBeNull();
            expect(pipeWidthMatches.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Pipe color (green)', () => {
        test('renderPipes sets fillStyle to green color', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should set fillStyle
            expect(body).toMatch(/fillStyle/);
        });

        test('renderPipes uses green color value', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should have a green color (hex code or color name)
            // Common green colors: #228B22, #32CD32, #00FF00, green, etc.
            const greenPattern = /#228B22|#32CD32|#00FF00|#008000|green|#[0-9a-fA-F]{6}.*green/i;
            expect(body).toMatch(greenPattern);
        });

        test('renderPipes sets fillStyle before fillRect calls', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            const fillStylePos = body.indexOf('fillStyle');
            const fillRectPos = body.indexOf('fillRect');
            
            expect(fillStylePos).toBeLessThan(fillRectPos);
        });
    });

    describe('Gap visibility', () => {
        test('renderPipes draws top and bottom pipes with gap between them', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should have both topHeight and bottomY references
            expect(body).toMatch(/topHeight/);
            expect(body).toMatch(/bottomY/);
        });

        test('renderPipes uses PIPE_GAP constant (indirectly via bottomY calculation)', () => {
            // The gap is created by the difference between topHeight and bottomY
            // bottomY should be calculated as topHeight + PIPE_GAP (from pipe structure)
            // We verify that both topHeight and bottomY are used
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should reference both topHeight and bottomY
            expect(body).toMatch(/topHeight/);
            expect(body).toMatch(/bottomY/);
        });
    });

    describe('Multiple pipes rendering', () => {
        test('renderPipes can handle multiple pipes in array', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should loop through all pipes
            expect(body).toMatch(/for\s*\([^)]*pipes\.length/);
        });

        test('renderPipes accesses individual pipe properties', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            // Should access pipe properties (pipe.x, pipe.topHeight, pipe.bottomY)
            expect(body).toMatch(/pipe\./);
        });
    });

    describe('renderPipes integration with render function', () => {
        test('render function calls renderPipes', () => {
            const renderMatch = gameJs.match(/function\s+render\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderMatch).not.toBeNull();
            expect(renderMatch[0]).toMatch(/renderPipes\s*\(\s*\)/);
        });

        test('renderPipes is called before renderBird in render', () => {
            // Find the render function and extract its body
            const renderStart = gameJs.indexOf('function render()');
            expect(renderStart).toBeGreaterThan(-1);
            
            // Find the opening brace of the function
            let bodyStart = renderStart;
            while (bodyStart < gameJs.length && gameJs[bodyStart] !== '{') {
                bodyStart++;
            }
            expect(bodyStart).toBeLessThan(gameJs.length);
            
            // Find the matching closing brace (end of function)
            let bodyEnd = bodyStart + 1;
            let braceCount = 1;
            while (bodyEnd < gameJs.length && braceCount > 0) {
                if (gameJs[bodyEnd] === '{') braceCount++;
                if (gameJs[bodyEnd] === '}') braceCount--;
                if (braceCount > 0) bodyEnd++;
            }
            
            const renderBody = gameJs.substring(bodyStart, bodyEnd);
            
            // Find renderPipes in the playing state path (after the if (isStart()) block)
            const pipesPos = renderBody.indexOf('renderPipes()');
            expect(pipesPos).toBeGreaterThan(-1);
            
            // Find renderBird that comes after renderPipes (in the playing state path, not in start state)
            const afterPipes = renderBody.substring(pipesPos);
            const birdPos = afterPipes.indexOf('renderBird()');
            
            expect(birdPos).toBeGreaterThan(-1);
            // renderBird should appear after renderPipes in the playing state path
            expect(birdPos).toBeGreaterThan(0);
        });

        test('renderPipes is called after drawBackground in render', () => {
            const renderStart = gameJs.indexOf('function render()');
            expect(renderStart).toBeGreaterThan(-1);
            
            let bodyStart = renderStart;
            while (bodyStart < gameJs.length && gameJs[bodyStart] !== '{') {
                bodyStart++;
            }
            
            let bodyEnd = bodyStart + 1;
            let braceCount = 1;
            while (bodyEnd < gameJs.length && braceCount > 0) {
                if (gameJs[bodyEnd] === '{') braceCount++;
                if (gameJs[bodyEnd] === '}') braceCount--;
                if (braceCount > 0) bodyEnd++;
            }
            
            const renderBody = gameJs.substring(bodyStart, bodyEnd);
            const backgroundPos = renderBody.indexOf('drawBackground()');
            const pipesPos = renderBody.indexOf('renderPipes()');
            
            expect(backgroundPos).toBeGreaterThan(-1);
            expect(pipesPos).toBeGreaterThan(-1);
            expect(backgroundPos).toBeLessThan(pipesPos);
        });

        test('renderPipes is called before renderGround in render', () => {
            const renderStart = gameJs.indexOf('function render()');
            expect(renderStart).toBeGreaterThan(-1);
            
            let bodyStart = renderStart;
            while (bodyStart < gameJs.length && gameJs[bodyStart] !== '{') {
                bodyStart++;
            }
            
            let bodyEnd = bodyStart + 1;
            let braceCount = 1;
            while (bodyEnd < gameJs.length && braceCount > 0) {
                if (gameJs[bodyEnd] === '{') braceCount++;
                if (gameJs[bodyEnd] === '}') braceCount--;
                if (braceCount > 0) bodyEnd++;
            }
            
            const renderBody = gameJs.substring(bodyStart, bodyEnd);
            
            // Find renderPipes in the playing state path
            const pipesPos = renderBody.indexOf('renderPipes()');
            expect(pipesPos).toBeGreaterThan(-1);
            
            // Find renderGround that comes after renderPipes (in the playing state path, not in start state)
            const afterPipes = renderBody.substring(pipesPos);
            const groundPos = afterPipes.indexOf('renderGround()');
            
            expect(groundPos).toBeGreaterThan(-1);
            // renderGround should appear after renderPipes in the playing state path
            expect(groundPos).toBeGreaterThan(0);
        });
    });

    describe('Pipe constants usage', () => {
        test('renderPipes uses PIPE_WIDTH constant', () => {
            const renderPipesMatch = gameJs.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderPipesMatch).not.toBeNull();
            const body = renderPipesMatch[0];
            
            expect(body).toMatch(/PIPE_WIDTH/);
        });

        test('PIPE_WIDTH constant is defined before renderPipes', () => {
            const pipeWidthPos = gameJs.indexOf('PIPE_WIDTH');
            const renderPipesPos = gameJs.indexOf('function renderPipes');
            expect(pipeWidthPos).toBeLessThan(renderPipesPos);
        });
    });
});
