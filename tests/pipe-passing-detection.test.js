/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F022: Detect Pipe Passing', () => {
    let gameJs;

    beforeEach(() => {
        // Set up DOM with canvas
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('Pipe object has passed property', () => {
        test('spawnPipe creates pipe object with passed property', () => {
            const funcStart = gameJs.indexOf('function spawnPipe()');
            if (funcStart === -1) {
                throw new Error('spawnPipe function not found');
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
                        expect(body).toMatch(/passed:/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('spawnPipe sets passed property to false', () => {
            const funcStart = gameJs.indexOf('function spawnPipe()');
            if (funcStart === -1) {
                throw new Error('spawnPipe function not found');
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
                        expect(body).toMatch(/passed:\s*false/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('passed property is in newPipe object creation', () => {
            const funcStart = gameJs.indexOf('function spawnPipe()');
            if (funcStart === -1) {
                throw new Error('spawnPipe function not found');
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
                        // Check that passed is in the same object as x, topHeight, bottomY
                        const newPipeMatch = body.match(/newPipe\s*=\s*\{[\s\S]*?\}/);
                        expect(newPipeMatch).not.toBeNull();
                        expect(newPipeMatch[0]).toMatch(/passed:/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Pipe passing detection logic', () => {
        test('updatePipes checks if bird passes pipes', () => {
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
                        // Should check bird.x > pipe.x + PIPE_WIDTH
                        expect(body).toMatch(/bird\.x\s*>\s*pipe/);
                        expect(body).toMatch(/PIPE_WIDTH/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes only checks pipes where passed === false', () => {
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
                        // Should check !pipe.passed or pipe.passed === false
                        expect(body).toMatch(/!pipe\.passed|pipe\.passed\s*===\s*false/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes sets pipe.passed to true when bird passes', () => {
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
                        // Should set pipe.passed = true
                        expect(body).toMatch(/pipe\.passed\s*=\s*true/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Pipe passing detection happens in updatePipes function', () => {
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
                        // Should have comment about detecting pipe passing or check for passed property
                        expect(body).toMatch(/passed|Detect when bird passes/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Pipe passing detection checks bird x position against pipe right edge', () => {
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
                        // Should check bird.x > pipe.x + PIPE_WIDTH (bird past pipe right edge)
                        expect(body).toMatch(/bird\.x\s*>\s*pipe\.x\s*\+\s*PIPE_WIDTH/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Pipe passing detection order', () => {
        test('Pipe passing detection happens after pipe movement', () => {
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
                        // Find positions of key operations
                        const movePipesPos = body.indexOf('PIPE_SPEED');
                        const passedCheckPos = body.indexOf('passed');
                        // Pipe passing detection should come after movement
                        expect(passedCheckPos).toBeGreaterThan(movePipesPos);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Pipe passing detection happens before pipe removal', () => {
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
                        // Find positions of key operations
                        const passedCheckPos = body.indexOf('passed');
                        const splicePos = body.indexOf('splice');
                        // Pipe passing detection should come before removal
                        expect(passedCheckPos).toBeLessThan(splicePos);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Pipe passing detection logic correctness', () => {
        test('Pipe passing uses correct comparison (bird.x > pipe.x + PIPE_WIDTH)', () => {
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
                        // Should use > (greater than) not >= (greater than or equal)
                        // This ensures bird passes completely past the pipe
                        const passingCheck = body.match(/bird\.x\s*>\s*pipe\.x\s*\+\s*PIPE_WIDTH/);
                        expect(passingCheck).not.toBeNull();
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Pipe passing detection loops through all pipes', () => {
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
                        // Should have a loop (for or while) that checks pipes
                        expect(body).toMatch(/for\s*\(|while\s*\(/);
                        expect(body).toMatch(/pipes\.length/);
                        expect(body).toMatch(/passed/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });
});
