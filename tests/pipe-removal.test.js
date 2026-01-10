/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F018: Remove Off-Screen Pipes', () => {
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

    describe('updatePipes removes off-screen pipes', () => {
        test('updatePipes checks pipe x position for removal', () => {
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
                        // Should check pipe.x + PIPE_WIDTH < 0
                        expect(body).toMatch(/pipe.*x.*PIPE_WIDTH.*<.*0|PIPE_WIDTH.*pipe.*x.*<.*0/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes checks if pipe right edge is off-screen', () => {
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
                        // Should check pipe.x + PIPE_WIDTH < 0 (right edge is off-screen)
                        expect(body).toMatch(/pipes\[.*\]\.x\s*\+\s*PIPE_WIDTH\s*<\s*0/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes removes pipes from array when off-screen', () => {
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
                        // Should use splice or filter to remove pipes
                        expect(body).toMatch(/splice|filter/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes uses PIPE_WIDTH constant in removal check', () => {
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
                        // Should reference PIPE_WIDTH in removal logic
                        expect(body).toMatch(/PIPE_WIDTH/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Pipe removal logic correctness', () => {
        test('updatePipes checks pipes array for removal', () => {
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
                        // Should reference pipes array in removal logic
                        expect(body).toMatch(/pipes\[/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes removes pipes after movement update', () => {
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
                        // Should have movement logic before removal logic
                        const movePos = body.indexOf('PIPE_SPEED');
                        const removePos = body.indexOf('splice') !== -1 ? body.indexOf('splice') : body.indexOf('filter');
                        expect(movePos).not.toBe(-1);
                        expect(removePos).not.toBe(-1);
                        expect(movePos).toBeLessThan(removePos);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Memory management', () => {
        test('updatePipes properly removes pipes from array', () => {
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
                        // Should use splice or filter to actually remove elements
                        expect(body).toMatch(/pipes\.(splice|filter)/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes uses safe array removal method', () => {
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
                        // Should use splice (safe for reverse iteration) or filter (creates new array)
                        const hasSplice = body.includes('splice');
                        const hasFilter = body.includes('filter');
                        expect(hasSplice || hasFilter).toBe(true);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Edge cases', () => {
        test('updatePipes handles pipes exactly at left edge', () => {
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
                        // Should check for < 0 (strictly off-screen), not <= 0
                        // This means pipe at x = -PIPE_WIDTH is removed, but x = 0 is not
                        expect(body).toMatch(/<\s*0/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes handles empty pipes array', () => {
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
                        // Should loop through pipes array, which handles empty array gracefully
                        expect(body).toMatch(/for\s*\([^)]*pipes\.length/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Integration with pipe movement', () => {
        test('updatePipes removes pipes after moving them', () => {
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
                        // Should have both movement and removal logic
                        const hasMovement = body.includes('PIPE_SPEED') && body.includes('x');
                        const hasRemoval = body.includes('splice') || body.includes('filter');
                        expect(hasMovement).toBe(true);
                        expect(hasRemoval).toBe(true);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes maintains correct order of operations', () => {
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
                        // Order should be: check gameOver -> move pipes -> remove pipes -> spawn new pipe
                        const gameOverPos = body.indexOf('gameOver');
                        const movePos = body.indexOf('PIPE_SPEED');
                        const removePos = body.indexOf('splice') !== -1 ? body.indexOf('splice') : body.indexOf('filter');
                        const spawnPos = body.indexOf('spawnPipe');
                        
                        expect(gameOverPos).not.toBe(-1);
                        expect(movePos).not.toBe(-1);
                        expect(removePos).not.toBe(-1);
                        expect(spawnPos).not.toBe(-1);
                        expect(gameOverPos).toBeLessThan(movePos);
                        expect(movePos).toBeLessThan(removePos);
                        expect(removePos).toBeLessThan(spawnPos);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });
});
