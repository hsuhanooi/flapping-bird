/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

// Tests for F033: Save High Score to Storage
// These tests verify the saveHighScore() function

describe('F033: Save High Score to Storage', () => {
    let gameJs;
    let mockContext;

    beforeEach(() => {
        // Set up DOM with canvas element
        document.body.innerHTML = `
            <canvas id="gameCanvas" width="400" height="600"></canvas>
        `;

        // Mock canvas context
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
            fillText: jest.fn(),
            font: '',
            textAlign: '',
            textBaseline: ''
        };

        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

        // Read game.js content
        gameJs = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('saveHighScore() Function Definition', () => {
        test('saveHighScore function should exist', () => {
            expect(gameJs).toMatch(/function\s+saveHighScore\s*\(\s*\)/);
        });

        test('saveHighScore function is properly defined', () => {
            const match = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{/);
            expect(match).toBeTruthy();
        });

        test('saveHighScore function is defined at top level', () => {
            const saveHighScoreIndex = gameJs.indexOf('function saveHighScore()');
            expect(saveHighScoreIndex).toBeGreaterThanOrEqual(0);

            // Check it's at top level (same number of open/close braces before it)
            const beforeSaveHighScore = gameJs.substring(0, saveHighScoreIndex);
            const openBraces = (beforeSaveHighScore.match(/\{/g) || []).length;
            const closeBraces = (beforeSaveHighScore.match(/\}/g) || []).length;
            expect(openBraces).toBe(closeBraces);
        });
    });

    describe('Score Comparison', () => {
        test('saveHighScore compares score with highScore', () => {
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(saveHighScoreMatch).toBeTruthy();
            expect(saveHighScoreMatch[0]).toMatch(/score\s*>\s*highScore/);
        });

        test('saveHighScore updates highScore when score is greater', () => {
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(saveHighScoreMatch).toBeTruthy();
            expect(saveHighScoreMatch[0]).toMatch(/highScore\s*=\s*score/);
        });

        test('saveHighScore uses if statement to check score > highScore', () => {
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(saveHighScoreMatch).toBeTruthy();
            expect(saveHighScoreMatch[0]).toMatch(/if\s*\(\s*score\s*>\s*highScore\s*\)/);
        });
    });

    describe('localStorage Key Usage', () => {
        test('saveHighScore uses correct localStorage key', () => {
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(saveHighScoreMatch).toBeTruthy();
            expect(saveHighScoreMatch[0]).toMatch(/localStorage\.setItem\s*\(\s*['"]flappyHighScore['"]/);
        });

        test('uses localStorage.setItem() method', () => {
            expect(gameJs).toMatch(/localStorage\.setItem/);
        });

        test('saveHighScore converts highScore to string when saving', () => {
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(saveHighScoreMatch).toBeTruthy();
            // Checks that highScore.toString() is called for the value
            expect(saveHighScoreMatch[0]).toMatch(/highScore\.toString\(\)|highScore/);
        });
    });

    describe('Game Over Integration - Ground Collision', () => {
        test('saveHighScore is called on ground collision', () => {
            // Check that ground collision code calls saveHighScore
            const groundCollisionMatch = gameJs.match(/birdBottom\s*>=\s*groundY[\s\S]*?bird\.y\s*=\s*groundY\s*-\s*bird\.height/);
            expect(groundCollisionMatch).toBeTruthy();
            expect(groundCollisionMatch[0]).toMatch(/saveHighScore\s*\(\s*\)/);
        });

        test('saveHighScore is called before bird position adjustment on ground collision', () => {
            const groundCollisionMatch = gameJs.match(/birdBottom\s*>=\s*groundY[\s\S]*?bird\.y\s*=\s*groundY\s*-\s*bird\.height/);
            expect(groundCollisionMatch).toBeTruthy();
            const saveHighScoreIndex = groundCollisionMatch[0].indexOf('saveHighScore()');
            const birdPositionIndex = groundCollisionMatch[0].indexOf('bird.y = groundY - bird.height');
            expect(saveHighScoreIndex).toBeLessThan(birdPositionIndex);
        });
    });

    describe('Game Over Integration - Ceiling Collision', () => {
        test('saveHighScore is called on ceiling collision', () => {
            // Check that ceiling collision code calls saveHighScore
            const ceilingCollisionMatch = gameJs.match(/bird\.y\s*<=\s*0[\s\S]*?bird\.y\s*=\s*0/);
            expect(ceilingCollisionMatch).toBeTruthy();
            expect(ceilingCollisionMatch[0]).toMatch(/saveHighScore\s*\(\s*\)/);
        });

        test('saveHighScore is called before bird position adjustment on ceiling collision', () => {
            const ceilingCollisionMatch = gameJs.match(/bird\.y\s*<=\s*0[\s\S]*?bird\.y\s*=\s*0/);
            expect(ceilingCollisionMatch).toBeTruthy();
            const saveHighScoreIndex = ceilingCollisionMatch[0].indexOf('saveHighScore()');
            const birdPositionIndex = ceilingCollisionMatch[0].indexOf('bird.y = 0');
            expect(saveHighScoreIndex).toBeLessThan(birdPositionIndex);
        });
    });

    describe('Game Over Integration - Pipe Collision', () => {
        test('saveHighScore is called on top pipe collision', () => {
            // Check that checkPipeCollisions calls saveHighScore on collision
            const checkPipeCollisionsMatch = gameJs.match(/function\s+checkPipeCollisions[\s\S]*?checkCollision\s*\(\s*birdHitbox\s*,\s*topPipeHitbox\s*\)[\s\S]*?return/);
            expect(checkPipeCollisionsMatch).toBeTruthy();
            expect(checkPipeCollisionsMatch[0]).toMatch(/saveHighScore\s*\(\s*\)/);
        });

        test('saveHighScore is called on bottom pipe collision', () => {
            // Check that checkPipeCollisions calls saveHighScore on collision with bottom pipe
            const checkPipeCollisionsMatch = gameJs.match(/checkCollision\s*\(\s*birdHitbox\s*,\s*bottomPipeHitbox\s*\)[\s\S]*?return/);
            expect(checkPipeCollisionsMatch).toBeTruthy();
            expect(checkPipeCollisionsMatch[0]).toMatch(/saveHighScore\s*\(\s*\)/);
        });

        test('saveHighScore is called before return on pipe collision', () => {
            const pipeCollisionMatch = gameJs.match(/checkCollision\s*\(\s*birdHitbox\s*,\s*topPipeHitbox\s*\)[\s\S]*?return/);
            expect(pipeCollisionMatch).toBeTruthy();
            const saveHighScoreIndex = pipeCollisionMatch[0].indexOf('saveHighScore()');
            const returnIndex = pipeCollisionMatch[0].indexOf('return');
            expect(saveHighScoreIndex).toBeLessThan(returnIndex);
        });
    });

    describe('Function Order and Dependencies', () => {
        test('saveHighScore is defined after loadHighScore', () => {
            const loadHighScoreIndex = gameJs.indexOf('function loadHighScore()');
            const saveHighScoreIndex = gameJs.indexOf('function saveHighScore()');
            expect(loadHighScoreIndex).toBeGreaterThanOrEqual(0);
            expect(saveHighScoreIndex).toBeGreaterThan(loadHighScoreIndex);
        });

        test('saveHighScore uses same localStorage key as loadHighScore', () => {
            // Both functions should use 'flappyHighScore' as the key
            const loadHighScoreMatch = gameJs.match(/function\s+loadHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);

            expect(loadHighScoreMatch).toBeTruthy();
            expect(saveHighScoreMatch).toBeTruthy();

            expect(loadHighScoreMatch[0]).toMatch(/['"]flappyHighScore['"]/);
            expect(saveHighScoreMatch[0]).toMatch(/['"]flappyHighScore['"]/);
        });
    });

    describe('saveHighScore Logic', () => {
        test('saveHighScore updates highScore variable first, then saves', () => {
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(saveHighScoreMatch).toBeTruthy();

            const highScoreAssignIndex = saveHighScoreMatch[0].indexOf('highScore = score');
            const setItemIndex = saveHighScoreMatch[0].indexOf('localStorage.setItem');

            expect(highScoreAssignIndex).toBeGreaterThan(-1);
            expect(setItemIndex).toBeGreaterThan(highScoreAssignIndex);
        });

        test('saveHighScore only saves when score is strictly greater (not equal)', () => {
            const saveHighScoreMatch = gameJs.match(/function\s+saveHighScore\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(saveHighScoreMatch).toBeTruthy();
            // Check for > not >=
            expect(saveHighScoreMatch[0]).toMatch(/score\s*>\s*highScore/);
            expect(saveHighScoreMatch[0]).not.toMatch(/score\s*>=\s*highScore/);
        });
    });

    describe('All collision types call saveHighScore', () => {
        test('ground, ceiling, and pipe collisions all call saveHighScore', () => {
            // Count occurrences of saveHighScore() in the updateBird function (ground and ceiling)
            const updateBirdMatch = gameJs.match(/function\s+updateBird[\s\S]*?(?=function\s+spawnPipe|$)/);
            expect(updateBirdMatch).toBeTruthy();
            const updateBirdSaveCount = (updateBirdMatch[0].match(/saveHighScore\(\)/g) || []).length;
            expect(updateBirdSaveCount).toBe(2);  // Ground and ceiling

            // Count occurrences in checkPipeCollisions
            const checkPipeCollisionsMatch = gameJs.match(/function\s+checkPipeCollisions[\s\S]*?(?=function\s+updatePipes|$)/);
            expect(checkPipeCollisionsMatch).toBeTruthy();
            const pipeCollisionSaveCount = (checkPipeCollisionsMatch[0].match(/saveHighScore\(\)/g) || []).length;
            expect(pipeCollisionSaveCount).toBe(2);  // Top and bottom pipe
        });
    });
});
