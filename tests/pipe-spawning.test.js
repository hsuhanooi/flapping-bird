/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F017: Spawn New Pipes', () => {
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

    describe('PIPE_SPAWN_INTERVAL constant', () => {
        test('PIPE_SPAWN_INTERVAL constant is defined', () => {
            expect(gameJs).toMatch(/const\s+PIPE_SPAWN_INTERVAL\s*=/);
        });

        test('PIPE_SPAWN_INTERVAL has value 90', () => {
            expect(gameJs).toMatch(/const\s+PIPE_SPAWN_INTERVAL\s*=\s*90/);
        });

        test('PIPE_SPAWN_INTERVAL is defined with other pipe constants', () => {
            const pipeSpeedPos = gameJs.indexOf('PIPE_SPEED');
            const spawnIntervalPos = gameJs.indexOf('PIPE_SPAWN_INTERVAL');
            expect(spawnIntervalPos).toBeGreaterThan(pipeSpeedPos);
        });
    });

    describe('frameCount variable', () => {
        test('frameCount variable is declared', () => {
            expect(gameJs).toMatch(/let\s+frameCount\s*=/);
        });

        test('frameCount is initialized to 0', () => {
            expect(gameJs).toMatch(/let\s+frameCount\s*=\s*0/);
        });

        test('frameCount is declared in game state section', () => {
            const gameOverPos = gameJs.indexOf('let gameOver');
            const frameCountPos = gameJs.indexOf('let frameCount');
            expect(frameCountPos).toBeGreaterThan(gameOverPos);
            // Should be close to gameOver declaration
            expect(frameCountPos - gameOverPos).toBeLessThan(200);
        });
    });

    describe('spawnPipe function existence', () => {
        test('spawnPipe function is defined', () => {
            expect(gameJs).toMatch(/function\s+spawnPipe\s*\(\s*\)/);
        });

        test('spawnPipe function has a function body', () => {
            const match = gameJs.match(/function\s+spawnPipe\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(match).not.toBeNull();
            expect(match[0].length).toBeGreaterThan(30);
        });
    });

    describe('spawnPipe generates random pipe', () => {
        test('spawnPipe calculates groundY', () => {
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
                        expect(body).toMatch(/groundY|CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('spawnPipe generates random topHeight', () => {
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
                        expect(body).toMatch(/topHeight|Math\.random/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('spawnPipe calculates bottomY from topHeight and PIPE_GAP', () => {
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
                        expect(body).toMatch(/bottomY|topHeight\s*\+\s*PIPE_GAP/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('spawnPipe creates pipe object with x, topHeight, bottomY', () => {
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
                        expect(body).toMatch(/x:\s*CANVAS_WIDTH/);
                        expect(body).toMatch(/topHeight:/);
                        expect(body).toMatch(/bottomY:/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('spawnPipe adds pipe to pipes array', () => {
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
                        expect(body).toMatch(/pipes\.push/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('spawnPipe sets pipe x to CANVAS_WIDTH', () => {
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
                        expect(body).toMatch(/x:\s*CANVAS_WIDTH/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('spawnPipe random topHeight bounds', () => {
        test('spawnPipe generates topHeight between 50 and (groundY - PIPE_GAP - 50)', () => {
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
                        // Should have min value of 50
                        expect(body).toMatch(/50/);
                        // Should calculate max based on groundY - PIPE_GAP - 50
                        expect(body).toMatch(/PIPE_GAP/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('updatePipes calls spawnPipe', () => {
        test('updatePipes checks frameCount modulo PIPE_SPAWN_INTERVAL', () => {
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
                        expect(body).toMatch(/frameCount\s*%\s*PIPE_SPAWN_INTERVAL/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });

        test('updatePipes calls spawnPipe when frameCount % PIPE_SPAWN_INTERVAL === 0', () => {
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
                        expect(body).toMatch(/spawnPipe\s*\(\s*\)/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('frameCount increment', () => {
        test('update function increments frameCount', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateMatch).not.toBeNull();
            const updateBody = updateMatch[0];
            expect(updateBody).toMatch(/frameCount\+\+|frameCount\s*=\s*frameCount\s*\+\s*1|\+\+\s*frameCount/);
        });

        test('frameCount is incremented at start of update function', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateMatch).not.toBeNull();
            const updateBody = updateMatch[0];
            const frameCountPos = updateBody.indexOf('frameCount');
            const updateBirdPos = updateBody.indexOf('updateBird');
            // frameCount increment should come before updateBird
            expect(frameCountPos).toBeLessThan(updateBirdPos);
        });
    });

    describe('frameCount reset', () => {
        test('initBird resets frameCount to 0', () => {
            const funcStart = gameJs.indexOf('function initBird()');
            if (funcStart === -1) {
                throw new Error('initBird function not found');
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
                        expect(body).toMatch(/frameCount\s*=\s*0/);
                        return;
                    }
                }
            }
            throw new Error('Could not find complete function body');
        });
    });

    describe('Pipe spawning interval behavior', () => {
        test('spawnPipe is called conditionally based on frameCount', () => {
            const updatePipesMatch = gameJs.match(/function\s+updatePipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updatePipesMatch).not.toBeNull();
            const updatePipesBody = updatePipesMatch[0];
            // Should have conditional check before calling spawnPipe
            expect(updatePipesBody).toMatch(/if\s*\(.*frameCount.*PIPE_SPAWN_INTERVAL/);
        });

        test('PIPE_SPAWN_INTERVAL is used in modulo check', () => {
            const updatePipesMatch = gameJs.match(/function\s+updatePipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updatePipesMatch).not.toBeNull();
            const updatePipesBody = updatePipesMatch[0];
            expect(updatePipesBody).toMatch(/PIPE_SPAWN_INTERVAL/);
        });
    });
});
