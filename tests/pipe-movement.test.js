/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F016: Implement Pipe Movement', () => {
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

    describe('PIPE_SPEED constant', () => {
        test('PIPE_SPEED constant is defined', () => {
            expect(gameJs).toMatch(/const\s+PIPE_SPEED\s*=/);
        });

        test('PIPE_SPEED has value 2', () => {
            expect(gameJs).toMatch(/const\s+PIPE_SPEED\s*=\s*2/);
        });

        test('PIPE_SPEED is defined before updatePipes function', () => {
            const pipeSpeedPos = gameJs.indexOf('PIPE_SPEED');
            const updatePipesPos = gameJs.indexOf('function updatePipes');
            expect(pipeSpeedPos).toBeLessThan(updatePipesPos);
        });
    });

    describe('updatePipes function existence', () => {
        test('updatePipes function is defined', () => {
            expect(gameJs).toMatch(/function\s+updatePipes\s*\(\s*\)/);
        });

        test('updatePipes function has a function body', () => {
            const match = gameJs.match(/function\s+updatePipes\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(match).not.toBeNull();
            expect(match[0].length).toBeGreaterThan(30);
        });
    });

    describe('updatePipes moves pipes left', () => {
        test('updatePipes loops through pipes array', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should have a loop (for, while, or forEach)
                        expect(body).toMatch(/for\s*\(|while\s*\(|\.forEach\s*\(/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes accesses pipes array', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should reference pipes array
                        expect(body).toMatch(/pipes/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes subtracts PIPE_SPEED from pipe x position', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should subtract PIPE_SPEED from pipe.x
                        // Pattern: pipe.x -= PIPE_SPEED or pipe.x = pipe.x - PIPE_SPEED
                        expect(body).toMatch(/pipes\[.*\]\.x\s*-=\s*PIPE_SPEED|pipes\[.*\]\.x\s*=\s*pipes\[.*\]\.x\s*-\s*PIPE_SPEED/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes uses PIPE_SPEED constant', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should reference PIPE_SPEED
                        expect(body).toMatch(/PIPE_SPEED/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('updatePipes respects game over state', () => {
        test('updatePipes checks gameOver flag', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should check gameOver
                        expect(body).toMatch(/gameOver/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes returns early if gameOver is true', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should have early return pattern: if (gameOver) { return; }
                        expect(body).toMatch(/if\s*\(\s*gameOver\s*\)/);
                        expect(body).toMatch(/return/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('updatePipes integration with update function', () => {
        test('update function calls updatePipes', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateMatch).not.toBeNull();
            expect(updateMatch[0]).toMatch(/updatePipes\s*\(\s*\)/);
        });

        test('updatePipes is called after updateBird in update', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateMatch).not.toBeNull();
            const updateBody = updateMatch[0];
            const birdPos = updateBody.indexOf('updateBird');
            const pipesPos = updateBody.indexOf('updatePipes');
            expect(birdPos).toBeLessThan(pipesPos);
        });
    });

    describe('Pipe movement behavior', () => {
        test('updatePipes modifies pipe x positions', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should modify pipe.x
                        expect(body).toMatch(/pipes\[.*\]\.x/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes moves pipes in negative x direction (left)', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should subtract (move left) - look for -= or - PIPE_SPEED
                        expect(body).toMatch(/-\s*PIPE_SPEED|-\s*=\s*PIPE_SPEED/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Multiple pipes movement', () => {
        test('updatePipes handles multiple pipes in array', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should loop through all pipes
                        expect(body).toMatch(/for\s*\([^)]*pipes\.length/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes accesses individual pipe x property', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updatePipes()');
            if (funcStart === -1) {
                throw new Error('updatePipes function not found');
            }
            let braceCount = 0;
            let bodyStart = -1;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') {
                    if (braceCount === 0) bodyStart = i;
                    braceCount++;
                } else if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        const body = gameJs.substring(bodyStart + 1, i);
                        // Should access pipes[i].x
                        expect(body).toMatch(/pipes\[.*\]\.x/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });
});
