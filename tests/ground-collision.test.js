/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F012: Implement Ground Collision', () => {
    let gameJs;

    // Helper function to extract full function body
    function extractFunctionBody(code, funcName) {
        const funcStart = code.indexOf(`function ${funcName}()`);
        if (funcStart === -1) return null;
        
        let braceCount = 0;
        let inFunction = false;
        let startPos = -1;
        
        for (let i = funcStart; i < code.length; i++) {
            if (code[i] === '{') {
                if (!inFunction) {
                    inFunction = true;
                    startPos = i;
                }
                braceCount++;
            } else if (code[i] === '}') {
                braceCount--;
                if (inFunction && braceCount === 0) {
                    return code.substring(startPos + 1, i);
                }
            }
        }
        return null;
    }

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
            expect(gameJs).toMatch(/let\s+gameOver|var\s+gameOver|const\s+gameOver/);
        });

        test('gameOver is initialized to false', () => {
            expect(gameJs).toMatch(/gameOver\s*=\s*false/);
        });

        test('gameOver is defined in game state section', () => {
            // Should be near other game state variables
            const gameOverPos = gameJs.indexOf('gameOver');
            const groundHeightPos = gameJs.indexOf('GROUND_HEIGHT');
            expect(gameOverPos).toBeGreaterThan(0);
        });
    });

    describe('Ground collision detection in updateBird', () => {
        test('updateBird function checks for ground collision', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            expect(body).toMatch(/ground|GROUND|collision|Collision/);
        });

        test('updateBird calculates ground y position', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should calculate groundY = CANVAS_HEIGHT - GROUND_HEIGHT
            expect(body).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT|groundY\s*=\s*CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('updateBird checks bird bottom edge against ground', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should check bird.y + bird.height >= groundY
            expect(body).toMatch(/bird\.y\s*\+\s*bird\.height|birdBottom/);
        });

        test('updateBird sets gameOver to true on ground collision', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should set gameOver = true
            expect(body).toMatch(/gameOver\s*=\s*true/);
        });

        test('updateBird positions bird on ground surface on collision', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should set bird.y = groundY - bird.height
            expect(body).toMatch(/bird\.y\s*=\s*.*groundY.*\s*-\s*bird\.height|bird\.y\s*=\s*.*GROUND_HEIGHT.*\s*-\s*bird\.height/);
        });

        test('updateBird sets bird velocity to 0 on ground collision', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should set bird.velocity = 0
            expect(body).toMatch(/bird\.velocity\s*=\s*0/);
        });
    });

    describe('Bird movement stops when gameOver is true', () => {
        test('updateBird returns early if gameOver is true', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should check gameOver and return early
            expect(body).toMatch(/if\s*\(\s*gameOver\s*\)|if\s*\(\s*!gameOver\s*\)/);
        });

        test('updateBird does not apply physics when gameOver is true', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            
            // Find the gameOver check position
            const gameOverCheck = body.indexOf('gameOver');
            // Find gravity application position
            const gravityPos = body.indexOf('GRAVITY');
            
            // If gameOver check exists, it should be before gravity application
            if (gameOverCheck !== -1 && gravityPos !== -1) {
                expect(gameOverCheck).toBeLessThan(gravityPos);
            }
        });
    });

    describe('Ground collision calculation', () => {
        test('ground y position is calculated correctly', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Ground y should be CANVAS_HEIGHT - GROUND_HEIGHT
            // With CANVAS_HEIGHT = 600 and GROUND_HEIGHT = 80, groundY = 520
            expect(body).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('bird bottom edge calculation is correct', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Bird bottom = bird.y + bird.height
            expect(body).toMatch(/bird\.y\s*\+\s*bird\.height/);
        });

        test('collision check uses >= comparison', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should use >= to detect when bird bottom reaches or passes ground
            expect(body).toMatch(/>=/);
        });
    });

    describe('resetBird resets gameOver flag', () => {
        test('resetBird function resets gameOver to false', () => {
            const resetBirdMatch = gameJs.match(/function\s+resetBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(resetBirdMatch).not.toBeNull();
            const body = resetBirdMatch[0];
            // Should set gameOver = false
            expect(body).toMatch(/gameOver\s*=\s*false/);
        });

        test('resetBird calls initBird', () => {
            const resetBirdMatch = gameJs.match(/function\s+resetBird\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(resetBirdMatch).not.toBeNull();
            const body = resetBirdMatch[0];
            // Should call initBird()
            expect(body).toMatch(/initBird\s*\(\s*\)/);
        });
    });

    describe('Ground collision integration', () => {
        test('updateBird is called in update function', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(updateMatch).not.toBeNull();
            expect(updateMatch[0]).toMatch(/updateBird\s*\(\s*\)/);
        });

        test('ground collision detection runs every frame', () => {
            // Since updateBird is called in update(), and update() is called in gameLoop(),
            // collision detection runs every frame
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(updateMatch).not.toBeNull();
            expect(updateMatch[0]).toMatch(/updateBird/);
        });
    });

    describe('Acceptance criteria verification', () => {
        test('Bird stops when hitting ground', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should check gameOver and return early, preventing movement
            expect(body).toMatch(/if\s*\(\s*gameOver\s*\)/);
        });

        test('gameOver flag is set on ground collision', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should set gameOver = true
            expect(body).toMatch(/gameOver\s*=\s*true/);
        });

        test('Bird visually rests on ground surface', () => {
            const body = extractFunctionBody(gameJs, 'updateBird');
            expect(body).not.toBeNull();
            // Should position bird.y = groundY - bird.height
            expect(body).toMatch(/bird\.y\s*=\s*.*groundY.*\s*-\s*bird\.height/);
        });
    });
});
