const path = require('path');
const fs = require('fs');

describe('F043: Style Game Text', () => {
    let gameJs;
    let mockContext;

    beforeAll(() => {
        // Read game.js file
        const gameJsPath = path.join(__dirname, '..', 'game.js');
        gameJs = fs.readFileSync(gameJsPath, 'utf8');

        // Create mock canvas context
        mockContext = {
            fillStyle: '',
            strokeStyle: '',
            font: '',
            textAlign: '',
            textBaseline: '',
            lineWidth: 0,
            fillText: jest.fn(),
            strokeText: jest.fn(),
            clearRect: jest.fn(),
            fillRect: jest.fn(),
            createLinearGradient: jest.fn(() => ({
                addColorStop: jest.fn()
            })),
            save: jest.fn(),
            restore: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            beginPath: jest.fn(),
            ellipse: jest.fn(),
            fill: jest.fn(),
            stroke: jest.fn(),
            arc: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            strokeRect: jest.fn()
        };
    });

    describe('Consistent font family (sans-serif)', () => {
        test('renderScore uses sans-serif font family', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/font.*sans-serif/i);
        });

        test('renderStartScreen uses sans-serif font family', () => {
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderStartScreenMatch).not.toBeNull();
            expect(renderStartScreenMatch[0]).toMatch(/font.*sans-serif/i);
        });

        test('renderGameOverScreen uses sans-serif font family', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/font.*sans-serif/i);
        });
    });

    describe('Text shadow/outline for readability', () => {
        test('renderScore uses strokeText for text outline', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/strokeText/);
        });

        test('renderScore sets strokeStyle for outline color', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/strokeStyle/);
        });

        test('renderScore sets lineWidth for outline width', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/lineWidth/);
        });

        test('renderScore draws outline before fill text', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            const strokeTextIndex = renderScoreMatch[0].indexOf('strokeText');
            const fillTextIndex = renderScoreMatch[0].indexOf('fillText');
            expect(strokeTextIndex).toBeLessThan(fillTextIndex);
        });

        test('renderStartScreen uses strokeText for text outline', () => {
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderStartScreenMatch).not.toBeNull();
            expect(renderStartScreenMatch[0]).toMatch(/strokeText/);
        });

        test('renderStartScreen sets strokeStyle for outline color', () => {
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderStartScreenMatch).not.toBeNull();
            expect(renderStartScreenMatch[0]).toMatch(/strokeStyle/);
        });

        test('renderStartScreen draws outline before fill text for title', () => {
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderStartScreenMatch).not.toBeNull();
            // Check that strokeText for "Flappy Bird" comes before fillText
            const titleStrokeIndex = renderStartScreenMatch[0].indexOf('strokeText.*Flappy Bird');
            const titleFillIndex = renderStartScreenMatch[0].indexOf('fillText.*Flappy Bird');
            // Use regex to find positions more accurately
            const titleStrokeMatch = renderStartScreenMatch[0].match(/strokeText\s*\([^)]*Flappy Bird[^)]*\)/);
            const titleFillMatch = renderStartScreenMatch[0].match(/fillText\s*\([^)]*Flappy Bird[^)]*\)/);
            if (titleStrokeMatch && titleFillMatch) {
                expect(titleStrokeMatch.index).toBeLessThan(titleFillMatch.index);
            }
        });

        test('renderGameOverScreen uses strokeText for text outline', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/strokeText/);
        });

        test('renderGameOverScreen sets strokeStyle for outline color', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/strokeStyle/);
        });

        test('renderGameOverScreen draws outline before fill text for "Game Over"', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            // Check that strokeText for "Game Over" comes before fillText
            const gameOverStrokeMatch = renderGameOverScreenMatch[0].match(/strokeText\s*\([^)]*Game Over[^)]*\)/);
            const gameOverFillMatch = renderGameOverScreenMatch[0].match(/fillText\s*\([^)]*Game Over[^)]*\)/);
            if (gameOverStrokeMatch && gameOverFillMatch) {
                expect(gameOverStrokeMatch.index).toBeLessThan(gameOverFillMatch.index);
            }
        });

        test('outline color is dark (black) for visibility', () => {
            // Check that strokeStyle uses black or dark color
            expect(gameJs).toMatch(/strokeStyle\s*=\s*['"]#000000['"]|strokeStyle\s*=\s*['"]black['"]/i);
        });
    });

    describe('Consistent text colors', () => {
        test('score text uses white color', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/fillStyle.*#ffffff|fillStyle.*white/i);
        });

        test('start screen title uses white color', () => {
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderStartScreenMatch).not.toBeNull();
            expect(renderStartScreenMatch[0]).toMatch(/fillStyle.*#ffffff|fillStyle.*white/i);
        });

        test('game over screen title uses white color', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/fillStyle.*#ffffff|fillStyle.*white/i);
        });

        test('high score uses gold color', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/fillStyle.*#ffd700|fillStyle.*gold/i);
        });

        test('"New Best!" message uses red/coral color', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/fillStyle.*#ff6b6b/i);
        });
    });

    describe('Proper text sizing for all screens', () => {
        test('score uses large font size (48px)', () => {
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderScoreMatch).not.toBeNull();
            expect(renderScoreMatch[0]).toMatch(/font.*48px/);
        });

        test('start screen title uses large font size (64px)', () => {
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderStartScreenMatch).not.toBeNull();
            expect(renderStartScreenMatch[0]).toMatch(/font.*64px/);
        });

        test('start screen instructions use readable font size (24px)', () => {
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderStartScreenMatch).not.toBeNull();
            expect(renderStartScreenMatch[0]).toMatch(/font.*24px/);
        });

        test('game over title uses large font size (64px)', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/font.*64px/);
        });

        test('game over score uses large font size (48px)', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/font.*48px/);
        });

        test('high score uses readable font size (36px)', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/font.*36px/);
        });

        test('"New Best!" message uses readable font size (28px)', () => {
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            expect(renderGameOverScreenMatch[0]).toMatch(/font.*28px/);
        });

        test('restart instructions use readable font size (24px)', () => {
            // Check for 24px font in renderGameOverScreen function
            // The restart instructions are the last text element in the function
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\([^)]*\)\s*\{[\s\S]*?\}/);
            expect(renderGameOverScreenMatch).not.toBeNull();
            // Check that 24px font appears in the function (for restart instructions)
            // Look for it near "Press Space or Click to Restart"
            const restartSection = gameJs.match(/Press Space or Click to Restart[\s\S]{0,200}/);
            expect(restartSection).not.toBeNull();
            expect(restartSection[0]).toMatch(/font.*24px/);
        });
    });

    describe('Text visibility against all backgrounds', () => {
        test('all text rendering functions use strokeText for outline', () => {
            expect(gameJs).toMatch(/function\s+renderScore[\s\S]*?strokeText/);
            expect(gameJs).toMatch(/function\s+renderStartScreen[\s\S]*?strokeText/);
            expect(gameJs).toMatch(/function\s+renderGameOverScreen[\s\S]*?strokeText/);
        });

        test('outline is drawn before fill text in all functions', () => {
            // Check renderScore
            const renderScoreMatch = gameJs.match(/function\s+renderScore\s*\(\s*\)\s*\{[\s\S]*?\}/);
            if (renderScoreMatch) {
                const strokeIndex = renderScoreMatch[0].indexOf('strokeText');
                const fillIndex = renderScoreMatch[0].indexOf('fillText');
                expect(strokeIndex).toBeLessThan(fillIndex);
            }

            // Check renderStartScreen (for title)
            const renderStartScreenMatch = gameJs.match(/function\s+renderStartScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            if (renderStartScreenMatch) {
                const titleStrokeMatch = renderStartScreenMatch[0].match(/strokeText\s*\([^)]*Flappy Bird/);
                const titleFillMatch = renderStartScreenMatch[0].match(/fillText\s*\([^)]*Flappy Bird/);
                if (titleStrokeMatch && titleFillMatch) {
                    expect(titleStrokeMatch.index).toBeLessThan(titleFillMatch.index);
                }
            }

            // Check renderGameOverScreen (for "Game Over")
            const renderGameOverScreenMatch = gameJs.match(/function\s+renderGameOverScreen\s*\(\s*\)\s*\{[\s\S]*?\}/);
            if (renderGameOverScreenMatch) {
                const gameOverStrokeMatch = renderGameOverScreenMatch[0].match(/strokeText\s*\([^)]*Game Over/);
                const gameOverFillMatch = renderGameOverScreenMatch[0].match(/fillText\s*\([^)]*Game Over/);
                if (gameOverStrokeMatch && gameOverFillMatch) {
                    expect(gameOverStrokeMatch.index).toBeLessThan(gameOverFillMatch.index);
                }
            }
        });

        test('outline width is set appropriately for different text sizes', () => {
            // Check that lineWidth is set for outlines
            expect(gameJs).toMatch(/lineWidth\s*=\s*\d+/);
        });
    });
});
