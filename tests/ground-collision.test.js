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
            expect(gameJs).toMatch(/let\s+gameOver|var\s+gameOver|const\s+gameOver/);
        });

        test('gameOver is initialized to false', () => {
            expect(gameJs).toMatch(/gameOver\s*=\s*false/);
        });

        test('gameOver is defined before updateBird function', () => {
            const gameOverPos = gameJs.indexOf('gameOver');
            const updateBirdPos = gameJs.indexOf('function updateBird');
            expect(gameOverPos).toBeLessThan(updateBirdPos);
        });
    });

    describe('Ground collision detection in updateBird', () => {
        test('updateBird calculates ground y position', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            expect(updateBirdMatch[0]).toMatch(/CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('updateBird checks bird bottom edge against ground', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            // Should check if bird bottom (bird.y + bird.height) >= groundY
            expect(body).toMatch(/bird\.y\s*\+\s*bird\.height|birdBottom/);
        });

        test('updateBird sets gameOver to true on ground collision', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            expect(updateBirdMatch[0]).toMatch(/gameOver\s*=\s*true/);
        });

        test('updateBird positions bird on ground surface on collision', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            // Should set bird.y = groundY - bird.height
            expect(body).toMatch(/bird\.y\s*=\s*groundY\s*-\s*bird\.height/);
        });

        test('updateBird sets bird velocity to 0 on ground collision', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            expect(updateBirdMatch[0]).toMatch(/bird\.velocity\s*=\s*0/);
        });
    });

    describe('Bird movement stops when gameOver is true', () => {
        test('updateBird returns early if gameOver is true', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            // Should check gameOver and return early
            expect(body).toMatch(/if\s*\(\s*gameOver\s*\)/);
            expect(body).toMatch(/return/);
        });

        test('gameOver check happens before physics updates', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            const gameOverCheckPos = body.indexOf('if (gameOver)');
            const gravityPos = body.indexOf('GRAVITY');
            expect(gameOverCheckPos).toBeLessThan(gravityPos);
        });
    });

    describe('Ground collision calculation', () => {
        test('ground y position is calculated as CANVAS_HEIGHT - GROUND_HEIGHT', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            expect(updateBirdMatch[0]).toMatch(/const\s+groundY\s*=\s*CANVAS_HEIGHT\s*-\s*GROUND_HEIGHT/);
        });

        test('bird bottom edge is calculated correctly', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            // Should calculate birdBottom = bird.y + bird.height
            expect(body).toMatch(/birdBottom\s*=\s*bird\.y\s*\+\s*bird\.height|bird\.y\s*\+\s*bird\.height\s*>=\s*groundY/);
        });

        test('collision check uses >= comparison', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            // Should check if birdBottom >= groundY
            expect(body).toMatch(/>=/);
        });
    });

    describe('Bird visual positioning on ground', () => {
        test('bird y position is set to rest on ground surface', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            // Should set bird.y = groundY - bird.height so bird sits on ground
            expect(body).toMatch(/bird\.y\s*=\s*groundY\s*-\s*bird\.height/);
        });

        test('bird position adjustment happens after collision detection', () => {
            const updateBirdMatch = gameJs.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateBirdMatch).not.toBeNull();
            const body = updateBirdMatch[0];
            const collisionCheckPos = body.indexOf('birdBottom');
            const positionAdjustPos = body.indexOf('bird.y = groundY');
            expect(collisionCheckPos).toBeLessThan(positionAdjustPos);
        });
    });

    describe('Game over state reset', () => {
        test('initBird resets gameOver to false', () => {
            const initBirdMatch = gameJs.match(/function\s+initBird\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(initBirdMatch).not.toBeNull();
            expect(initBirdMatch[0]).toMatch(/gameOver\s*=\s*false/);
        });
    });

    describe('Integration with update function', () => {
        test('update function calls updateBird', () => {
            const updateMatch = gameJs.match(/function\s+update\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(updateMatch).not.toBeNull();
            expect(updateMatch[0]).toMatch(/updateBird\s*\(\s*\)/);
        });
    });
});
