/**
 * F035: Add Touch Event Listener
 * Tests for touch input functionality on mobile devices
 */

const fs = require('fs');
const path = require('path');

describe('F035: Add Touch Event Listener', () => {
    let gameJs;

    beforeAll(() => {
        const gameJsPath = path.join(__dirname, '..', 'game.js');
        gameJs = fs.readFileSync(gameJsPath, 'utf8');
    });

    describe('handleTouch function existence', () => {
        test('handleTouch function is defined', () => {
            expect(gameJs).toMatch(/function\s+handleTouch/);
        });

        test('handleTouch function has a function body', () => {
            const functionMatch = gameJs.match(/function\s+handleTouch\s*\([^)]*\)\s*\{/);
            expect(functionMatch).toBeTruthy();
        });
    });

    describe('Touch event listener setup', () => {
        test('touchstart event listener is added to canvas', () => {
            expect(gameJs).toMatch(/canvas\.addEventListener\s*\(\s*['"]touchstart['"]/);
        });

        test('touchstart event listener calls handleTouch', () => {
            expect(gameJs).toMatch(/canvas\.addEventListener\s*\(\s*['"]touchstart['"]\s*,\s*handleTouch/);
        });
    });

    describe('Touch event prevents default behavior', () => {
        test('handleTouch calls preventDefault', () => {
            expect(gameJs).toMatch(/event\.preventDefault\s*\(\s*\)/);
        });

        test('preventDefault is called in handleTouch function', () => {
            const handleTouchMatch = gameJs.match(/function\s+handleTouch\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
            expect(handleTouchMatch).toBeTruthy();
            const handleTouchBody = handleTouchMatch[1];
            expect(handleTouchBody).toMatch(/event\.preventDefault/);
        });
    });

    describe('Touch handler reuses click logic', () => {
        test('handleTouch checks for start state', () => {
            expect(gameJs).toMatch(/handleTouch[\s\S]*?isStart\s*\(\s*\)/);
        });

        test('handleTouch checks for gameover state', () => {
            expect(gameJs).toMatch(/handleTouch[\s\S]*?isGameOver\s*\(\s*\)/);
        });

        test('handleTouch checks for playing state', () => {
            expect(gameJs).toMatch(/handleTouch[\s\S]*?isPlaying\s*\(\s*\)/);
        });

        test('handleTouch calls flap function', () => {
            expect(gameJs).toMatch(/handleTouch[\s\S]*?flap\s*\(\s*\)/);
        });

        test('handleTouch transitions from start to playing', () => {
            expect(gameJs).toMatch(/handleTouch[\s\S]*?gameState\s*=\s*['"]playing['"]/);
        });

        test('handleTouch calls resetGame when in gameover state', () => {
            expect(gameJs).toMatch(/handleTouch[\s\S]*?resetGame\s*\(\s*\)/);
        });
    });

    describe('Touch input behavior matches click', () => {
        test('handleTouch has same structure as handleClick', () => {
            // Both should check for start, gameover, and playing states
            const handleClickMatch = gameJs.match(/function\s+handleClick\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
            const handleTouchMatch = gameJs.match(/function\s+handleTouch\s*\([^)]*\)\s*\{([\s\S]*?)\n\}/);
            
            expect(handleClickMatch).toBeTruthy();
            expect(handleTouchMatch).toBeTruthy();
            
            const clickBody = handleClickMatch[1];
            const touchBody = handleTouchMatch[1];
            
            // Both should check for start state
            expect(clickBody).toMatch(/isStart\s*\(\s*\)/);
            expect(touchBody).toMatch(/isStart\s*\(\s*\)/);
            
            // Both should check for gameover state
            expect(clickBody).toMatch(/isGameOver\s*\(\s*\)/);
            expect(touchBody).toMatch(/isGameOver\s*\(\s*\)/);
            
            // Both should check for playing state
            expect(clickBody).toMatch(/isPlaying\s*\(\s*\)/);
            expect(touchBody).toMatch(/isPlaying\s*\(\s*\)/);
            
            // Both should call flap
            expect(clickBody).toMatch(/flap\s*\(\s*\)/);
            expect(touchBody).toMatch(/flap\s*\(\s*\)/);
        });
    });

    describe('Integration with existing input handlers', () => {
        test('keyboard, mouse, and touch event listeners are all set up', () => {
            expect(gameJs).toMatch(/document\.addEventListener\s*\(\s*['"]keydown['"]/);
            expect(gameJs).toMatch(/canvas\.addEventListener\s*\(\s*['"]click['"]/);
            expect(gameJs).toMatch(/canvas\.addEventListener\s*\(\s*['"]touchstart['"]/);
        });

        test('all input handlers are defined before event listeners', () => {
            const handleKeyDownIndex = gameJs.indexOf('function handleKeyDown');
            const handleClickIndex = gameJs.indexOf('function handleClick');
            const handleTouchIndex = gameJs.indexOf('function handleTouch');
            const keydownListenerIndex = gameJs.indexOf('document.addEventListener(\'keydown\'');
            const clickListenerIndex = gameJs.indexOf('canvas.addEventListener(\'click\'');
            const touchListenerIndex = gameJs.indexOf('canvas.addEventListener(\'touchstart\'');

            expect(handleKeyDownIndex).toBeLessThan(keydownListenerIndex);
            expect(handleClickIndex).toBeLessThan(clickListenerIndex);
            expect(handleTouchIndex).toBeLessThan(touchListenerIndex);
        });
    });
});
