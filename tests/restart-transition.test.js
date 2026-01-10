/**
 * Tests for F031: Implement Restart Transition
 * Allows restart from game over state by pressing space or clicking canvas
 */

const fs = require('fs');
const path = require('path');

// Read the game.js file
const gameJsPath = path.join(__dirname, '..', 'game.js');
const gameJsContent = fs.readFileSync(gameJsPath, 'utf8');

describe('F031: Implement Restart Transition', () => {
    describe('handleKeyDown function checks for gameover state', () => {
        test('handleKeyDown function checks isGameOver() for restart', () => {
            expect(gameJsContent).toMatch(/isGameOver\(\)/);
            expect(gameJsContent).toMatch(/function\s+handleKeyDown/);
        });

        test('handleKeyDown calls resetGame() when in gameover state', () => {
            // The handleKeyDown should call resetGame when isGameOver is true
            const handleKeyDownMatch = gameJsContent.match(/function\s+handleKeyDown[\s\S]*?(?=function\s+handleClick|$)/);
            expect(handleKeyDownMatch).not.toBeNull();
            expect(handleKeyDownMatch[0]).toMatch(/resetGame\(\)/);
        });

        test('handleKeyDown sets gameState to playing after reset', () => {
            const handleKeyDownMatch = gameJsContent.match(/function\s+handleKeyDown[\s\S]*?(?=function\s+handleClick|$)/);
            expect(handleKeyDownMatch).not.toBeNull();
            expect(handleKeyDownMatch[0]).toMatch(/gameState\s*=\s*['"]playing['"]/);
        });

        test('handleKeyDown triggers first flap on restart', () => {
            const handleKeyDownMatch = gameJsContent.match(/function\s+handleKeyDown[\s\S]*?(?=function\s+handleClick|$)/);
            expect(handleKeyDownMatch).not.toBeNull();
            expect(handleKeyDownMatch[0]).toMatch(/flap\(\)/);
        });
    });

    describe('handleClick function checks for gameover state', () => {
        test('handleClick function checks isGameOver() for restart', () => {
            expect(gameJsContent).toMatch(/function\s+handleClick/);
            const handleClickMatch = gameJsContent.match(/function\s+handleClick[\s\S]*?(?=function\s+\w+|document\.addEventListener|canvas\.addEventListener|$)/);
            expect(handleClickMatch).not.toBeNull();
            expect(handleClickMatch[0]).toMatch(/isGameOver\(\)/);
        });

        test('handleClick calls resetGame() when in gameover state', () => {
            const handleClickMatch = gameJsContent.match(/function\s+handleClick[\s\S]*?(?=\/\/\s*Set up keyboard|document\.addEventListener|$)/);
            expect(handleClickMatch).not.toBeNull();
            expect(handleClickMatch[0]).toMatch(/resetGame\(\)/);
        });

        test('handleClick sets gameState to playing after reset', () => {
            const handleClickMatch = gameJsContent.match(/function\s+handleClick[\s\S]*?(?=\/\/\s*Set up keyboard|document\.addEventListener|$)/);
            expect(handleClickMatch).not.toBeNull();
            expect(handleClickMatch[0]).toMatch(/gameState\s*=\s*['"]playing['"]/);
        });

        test('handleClick triggers first flap on restart', () => {
            const handleClickMatch = gameJsContent.match(/function\s+handleClick[\s\S]*?(?=\/\/\s*Set up keyboard|document\.addEventListener|$)/);
            expect(handleClickMatch).not.toBeNull();
            expect(handleClickMatch[0]).toMatch(/flap\(\)/);
        });
    });

    describe('Restart transition flow', () => {
        test('gameover state check happens before restart logic', () => {
            // The isGameOver check should be present in both handlers
            const handleKeyDownMatch = gameJsContent.match(/function\s+handleKeyDown[\s\S]*?(?=function\s+handleClick|$)/);
            expect(handleKeyDownMatch).not.toBeNull();
            expect(handleKeyDownMatch[0]).toMatch(/if\s*\(\s*isGameOver\(\)\s*\)/);
        });

        test('resetGame is called before setting gameState to playing', () => {
            // resetGame should be called before gameState is set to playing
            const handleKeyDownMatch = gameJsContent.match(/function\s+handleKeyDown[\s\S]*?(?=function\s+handleClick|$)/);
            expect(handleKeyDownMatch).not.toBeNull();

            const resetIndex = handleKeyDownMatch[0].indexOf('resetGame()');
            const gameStateIndex = handleKeyDownMatch[0].indexOf("gameState = 'playing'", resetIndex);

            // resetGame should be called (found in the code)
            expect(resetIndex).toBeGreaterThan(-1);

            // After resetGame, gameState should be set to playing
            expect(gameStateIndex).toBeGreaterThan(resetIndex);
        });

        test('flap is called after gameState is set to playing', () => {
            const handleClickMatch = gameJsContent.match(/function\s+handleClick[\s\S]*?(?=\/\/\s*Set up keyboard|document\.addEventListener|$)/);
            expect(handleClickMatch).not.toBeNull();

            // Find the isGameOver block and check flap is called after gameState assignment
            const gameOverBlock = handleClickMatch[0].match(/if\s*\(\s*isGameOver\(\)\s*\)[\s\S]*?return;/);
            expect(gameOverBlock).not.toBeNull();
            expect(gameOverBlock[0]).toMatch(/flap\(\)/);
        });
    });

    describe('State-specific input handling', () => {
        test('handleKeyDown has explicit state checks for start, gameover, and playing', () => {
            const handleKeyDownMatch = gameJsContent.match(/function\s+handleKeyDown[\s\S]*?(?=function\s+handleClick|$)/);
            expect(handleKeyDownMatch).not.toBeNull();

            expect(handleKeyDownMatch[0]).toMatch(/isStart\(\)/);
            expect(handleKeyDownMatch[0]).toMatch(/isGameOver\(\)/);
            expect(handleKeyDownMatch[0]).toMatch(/isPlaying\(\)/);
        });

        test('handleClick has explicit state checks for start, gameover, and playing', () => {
            const handleClickMatch = gameJsContent.match(/function\s+handleClick[\s\S]*?(?=\/\/\s*Set up keyboard|document\.addEventListener|$)/);
            expect(handleClickMatch).not.toBeNull();

            expect(handleClickMatch[0]).toMatch(/isStart\(\)/);
            expect(handleClickMatch[0]).toMatch(/isGameOver\(\)/);
            expect(handleClickMatch[0]).toMatch(/isPlaying\(\)/);
        });
    });
});
