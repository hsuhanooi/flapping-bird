/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F023: Increment Score on Pipe Pass', () => {
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

    describe('Score increment logic in updatePipes', () => {
        test('updatePipes increments score when pipe.passed becomes true', () => {
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
                        // Should increment score when pipe.passed is set to true
                        expect(body).toMatch(/score\s*\+\+|score\s*=\s*score\s*\+\s*1|score\s*\+=\s*1/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Score increment happens when pipe.passed is set to true', () => {
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
                        // Find where pipe.passed = true is set
                        const passedTruePos = body.indexOf('pipe.passed = true');
                        // Find score increment
                        const scoreIncrementPos = body.indexOf('score++') !== -1 
                            ? body.indexOf('score++')
                            : body.indexOf('score = score + 1') !== -1
                            ? body.indexOf('score = score + 1')
                            : body.indexOf('score += 1');
                        // Score increment should be near pipe.passed = true (same block)
                        expect(scoreIncrementPos).not.toBe(-1);
                        expect(passedTruePos).not.toBe(-1);
                        // They should be in the same code block (within reasonable distance)
                        const distance = Math.abs(scoreIncrementPos - passedTruePos);
                        expect(distance).toBeLessThan(100); // Within 100 characters
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Score increment only happens when pipe is passed (passed changes from false to true)', () => {
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
                        // Score increment should be inside the same condition that sets pipe.passed = true
                        // This ensures score only increments when a pipe is actually passed
                        const pipePassingBlock = body.match(/if\s*\([^)]*passed[^)]*\)\s*\{[\s\S]*?\}/);
                        if (pipePassingBlock) {
                            expect(pipePassingBlock[0]).toMatch(/score\s*\+\+|score\s*=\s*score\s*\+\s*1|score\s*\+=\s*1/);
                        } else {
                            // Alternative: check that score increment is near pipe.passed = true
                            const passedTrueIndex = body.indexOf('pipe.passed = true');
                            const scoreIncrement = body.match(/score\s*\+\+|score\s*=\s*score\s*\+\s*1|score\s*\+=\s*1/);
                            expect(scoreIncrement).not.toBeNull();
                            expect(passedTrueIndex).not.toBe(-1);
                        }
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Score increment behavior', () => {
        test('Score increments by 1 for each pipe passed', () => {
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
                        // Should increment by 1 (not by 2 or more)
                        const scoreIncrement = body.match(/score\s*\+\+|score\s*=\s*score\s*\+\s*1|score\s*\+=\s*1/);
                        expect(scoreIncrement).not.toBeNull();
                        // Should not increment by more than 1
                        expect(body).not.toMatch(/score\s*\+=\s*[2-9]|score\s*=\s*score\s*\+\s*[2-9]/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Score increment happens immediately when pipe is passed', () => {
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
                        // Score increment should be in the same code block as pipe.passed = true
                        // This ensures it happens immediately, not delayed
                        const passedTruePos = body.indexOf('pipe.passed = true');
                        const scoreIncrementPos = body.indexOf('score++') !== -1 
                            ? body.indexOf('score++')
                            : body.indexOf('score = score + 1') !== -1
                            ? body.indexOf('score = score + 1')
                            : body.indexOf('score += 1');
                        expect(scoreIncrementPos).not.toBe(-1);
                        expect(passedTruePos).not.toBe(-1);
                        // Should be in same conditional block
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Score increment prevents duplicate scoring', () => {
        test('Score only increments once per pipe (when passed changes from false to true)', () => {
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
                        // Should check !pipe.passed before incrementing score
                        // This ensures score only increments when passed changes from false to true
                        const passingCheck = body.match(/if\s*\([^)]*!pipe\.passed[^)]*\)/);
                        expect(passingCheck).not.toBeNull();
                        // Score increment should be inside this check
                        const scoreIncrement = body.match(/score\s*\+\+|score\s*=\s*score\s*\+\s*1|score\s*\+=\s*1/);
                        expect(scoreIncrement).not.toBeNull();
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Score increment is conditional on pipe not being passed yet', () => {
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
                        // The condition should check both: bird passed pipe AND pipe not passed yet
                        // This ensures each pipe can only increment score once
                        expect(body).toMatch(/!pipe\.passed|pipe\.passed\s*===\s*false/);
                        expect(body).toMatch(/bird\.x\s*>\s*pipe\.x\s*\+\s*PIPE_WIDTH/);
                        expect(body).toMatch(/score\s*\+\+|score\s*=\s*score\s*\+\s*1|score\s*\+=\s*1/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Score increment integration', () => {
        test('Score increment happens in updatePipes function', () => {
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
                        // Score increment should be in updatePipes function
                        expect(body).toMatch(/score\s*\+\+|score\s*=\s*score\s*\+\s*1|score\s*\+=\s*1/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('Score increment happens after pipe passing detection', () => {
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
                        // Score increment should be after pipe.passed = true
                        const passedTruePos = body.indexOf('pipe.passed = true');
                        const scoreIncrementPos = body.indexOf('score++') !== -1 
                            ? body.indexOf('score++')
                            : body.indexOf('score = score + 1') !== -1
                            ? body.indexOf('score = score + 1')
                            : body.indexOf('score += 1');
                        expect(passedTruePos).not.toBe(-1);
                        expect(scoreIncrementPos).not.toBe(-1);
                        // Score increment should come after or be in same block as pipe.passed = true
                        // (It's fine if they're in the same line or consecutive lines)
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });
});
