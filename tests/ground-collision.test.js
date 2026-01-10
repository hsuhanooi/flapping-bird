/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F012: Implement Ground Collision', () => {
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

    describe('gameOver flag variable', () => {
        test('gameOver variable is defined', () => {
            expect(gameJs).toMatch(/let\s+gameOver\s*=/);
        });

        test('gameOver is initialized to false', () => {
            expect(gameJs).toMatch(/let\s+gameOver\s*=\s*false/);
        });

        test('gameOver is defined before bird object', () => {
            const gameOverPos = gameJs.indexOf('let gameOver');
            const birdPos = gameJs.indexOf('const bird =');
            expect(gameOverPos).toBeLessThan(birdPos);
        });
    });

    describe('Ground y position calculation', () => {
        test('ground y position is calculated in updateBird', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updateBird()');
            expect(funcStart).not.toBe(-1);
            let braceCount = 0;
            let funcEnd = funcStart;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') braceCount++;
                if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        funcEnd = i + 1;
                        break;
                    }
                }
            }
            const functionBody = gameJs.substring(funcStart, funcEnd);
            expect(functionBody).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('ground y position uses correct formula', () => {
            // Match entire function body by counting braces
            const funcStart = gameJs.indexOf('function updateBird()');
            expect(funcStart).not.toBe(-1);
            let braceCount = 0;
            let funcEnd = funcStart;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') braceCount++;
                if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        funcEnd = i + 1;
                        break;
                    }
                }
            }
            const body = gameJs.substring(funcStart, funcEnd);
            // Should calculate: groundY = CANVAS_HEIGHT - GROUND_HEIGHT
            expect(body).toMatch(/groundY\s*=\s*CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });
    });

    describe('Ground collision detection', () => {
        function getUpdateBirdBody() {
            const funcStart = gameJs.indexOf('function updateBird()');
            if (funcStart === -1) return '';
            let braceCount = 0;
            let funcEnd = funcStart;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') braceCount++;
                if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        funcEnd = i + 1;
                        break;
                    }
                }
            }
            return gameJs.substring(funcStart, funcEnd);
        }

        test('updateBird checks for ground collision', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            // Should check bird bottom edge against ground y
            expect(body).toMatch(/birdBottom|bird\.y\s*\+\s*bird\.height/);
        });

        test('collision check uses bird bottom edge', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            // Should calculate bird bottom: bird.y + bird.height
            expect(body).toMatch(/bird\.y\s*\+\s*bird\.height/);
        });

        test('collision check compares against ground y', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            // Should compare birdBottom >= groundY
            expect(body).toMatch(/birdBottom\s*>=\s*groundY|groundY\s*<=\s*birdBottom/);
        });

        test('gameOver is set to true on ground collision', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            // Should set gameOver = true when collision detected
            expect(body).toMatch(/gameOver\s*=\s*true/);
        });
    });

    describe('Bird movement stops on game over', () => {
        test('updateBird returns early if gameOver is true', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            // Should check gameOver and return early
            expect(body).toMatch(/if\s*\(\s*gameOver\s*\)/);
            expect(body).toMatch(/return/);
        });

        test('gameOver check happens before physics updates', () => {
            const funcStart = gameJs.indexOf('function updateBird()');
            expect(funcStart).not.toBe(-1);
            let braceCount = 0;
            let funcEnd = funcStart;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') braceCount++;
                if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        funcEnd = i + 1;
                        break;
                    }
                }
            }
            const body = gameJs.substring(funcStart, funcEnd);
            
            const gameOverCheckPos = body.indexOf('if (gameOver)');
            const gravityPos = body.indexOf('bird.velocity += GRAVITY');
            
            expect(gameOverCheckPos).toBeLessThan(gravityPos);
        });
    });

    describe('Bird positioning on ground collision', () => {
        function getUpdateBirdBody() {
            const funcStart = gameJs.indexOf('function updateBird()');
            if (funcStart === -1) return '';
            let braceCount = 0;
            let funcEnd = funcStart;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') braceCount++;
                if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        funcEnd = i + 1;
                        break;
                    }
                }
            }
            return gameJs.substring(funcStart, funcEnd);
        }

        test('bird y position is set to ground surface on collision', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            // Should position bird on ground: bird.y = groundY - bird.height
            expect(body).toMatch(/bird\.y\s*=\s*groundY\s*-\s*bird\.height/);
        });

        test('bird velocity is set to 0 on ground collision', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            // Should set velocity to 0: bird.velocity = 0
            expect(body).toMatch(/bird\.velocity\s*=\s*0/);
        });
    });

    describe('Game over state reset', () => {
        test('initBird resets gameOver to false', () => {
            const initBirdMatch = gameJs.match(/function\s+initBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(initBirdMatch).not.toBeNull();
            const body = initBirdMatch[0];
            // Should reset gameOver: gameOver = false
            expect(body).toMatch(/gameOver\s*=\s*false/);
        });
    });

    describe('Collision detection logic', () => {
        function getUpdateBirdBody() {
            const funcStart = gameJs.indexOf('function updateBird()');
            if (funcStart === -1) return '';
            let braceCount = 0;
            let funcEnd = funcStart;
            for (let i = funcStart; i < gameJs.length; i++) {
                if (gameJs[i] === '{') braceCount++;
                if (gameJs[i] === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        funcEnd = i + 1;
                        break;
                    }
                }
            }
            return gameJs.substring(funcStart, funcEnd);
        }

        test('collision detection happens after position update', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            
            const positionUpdatePos = body.indexOf('bird.y += bird.velocity');
            const collisionCheckPos = body.indexOf('birdBottom');
            
            expect(positionUpdatePos).toBeLessThan(collisionCheckPos);
        });

        test('ground collision uses correct boundary check', () => {
            const body = getUpdateBirdBody();
            expect(body).not.toBe('');
            // Should check if bird bottom >= ground y (bird has reached or passed ground)
            expect(body).toMatch(/birdBottom\s*>=\s*groundY/);
        });
    });

    describe('Integration with update function', () => {
        test('update function calls updateBird', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(updateMatch).not.toBeNull();
            expect(updateMatch[0]).toMatch(/updateBird\s*\(\s*\)/);
        });
    });
});
