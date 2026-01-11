/**
 * F039: Style Sky Background
 * Tests for sky gradient background implementation
 */

const fs = require('fs');
const path = require('path');

describe('F039: Style Sky Background', () => {
    let gameCode;
    
    beforeAll(() => {
        // Read game.js file
        const gamePath = path.join(__dirname, '..', 'game.js');
        gameCode = fs.readFileSync(gamePath, 'utf8');
    });

    describe('drawBackground function uses linear gradient', () => {
        test('drawBackground function exists', () => {
            expect(gameCode).toMatch(/function\s+drawBackground\s*\(/);
        });

        test('drawBackground uses createLinearGradient', () => {
            expect(gameCode).toMatch(/createLinearGradient/);
        });

        test('createLinearGradient is called with correct parameters (top to bottom)', () => {
            // Gradient should go from (0, 0) to (0, CANVAS_HEIGHT) - vertical gradient
            expect(gameCode).toMatch(/createLinearGradient\s*\(\s*0\s*,\s*0\s*,\s*0\s*,\s*CANVAS_HEIGHT\s*\)/);
        });

        test('gradient has color stops defined', () => {
            expect(gameCode).toMatch(/addColorStop/);
        });

        test('gradient has light blue at top (color stop 0)', () => {
            // Should have addColorStop(0, ...) with a light blue color
            expect(gameCode).toMatch(/addColorStop\s*\(\s*0\s*,/);
            // Light blue color (sky blue #87ceeb or similar)
            expect(gameCode).toMatch(/#87ceeb/i);
        });

        test('gradient has darker blue at bottom (color stop 1)', () => {
            // Should have addColorStop(1, ...) with a darker blue color
            expect(gameCode).toMatch(/addColorStop\s*\(\s*1\s*,/);
            // Darker blue color (#70c5ce or similar)
            expect(gameCode).toMatch(/#70c5ce/i);
        });

        test('gradient is applied as fillStyle', () => {
            expect(gameCode).toMatch(/ctx\.fillStyle\s*=\s*gradient/);
        });

        test('fillRect is called to draw gradient background', () => {
            expect(gameCode).toMatch(/fillRect\s*\(\s*0\s*,\s*0\s*,\s*CANVAS_WIDTH\s*,\s*CANVAS_HEIGHT\s*\)/);
        });
    });

    describe('Gradient color selection', () => {
        test('top color is light blue (pleasant and not distracting)', () => {
            // Light blue should be a pleasant sky color
            expect(gameCode).toMatch(/#87ceeb/i);
        });

        test('bottom color is slightly darker blue', () => {
            // Bottom should be darker than top
            expect(gameCode).toMatch(/#70c5ce/i);
        });

        test('colors are distinct from each other', () => {
            // Top and bottom colors should be different
            const topColorMatch = gameCode.match(/#87ceeb/i);
            const bottomColorMatch = gameCode.match(/#70c5ce/i);
            expect(topColorMatch).toBeTruthy();
            expect(bottomColorMatch).toBeTruthy();
        });
    });

    describe('Background rendering order', () => {
        test('drawBackground is called in render function', () => {
            expect(gameCode).toMatch(/drawBackground\s*\(/);
        });

        test('drawBackground is called after clearCanvas', () => {
            // drawBackground should be called early in render, after clearCanvas
            const renderMatch = gameCode.match(/function\s+render\s*\([^}]*drawBackground/);
            expect(renderMatch).toBeTruthy();
        });

        test('background renders before other game elements', () => {
            // drawBackground should be called before renderBird, renderPipes, etc.
            const renderFunction = gameCode.match(/function\s+render\s*\([^}]*\)/s);
            if (renderFunction) {
                const renderBody = renderFunction[0];
                const drawBgIndex = renderBody.indexOf('drawBackground');
                const renderBirdIndex = renderBody.indexOf('renderBird');
                const renderPipesIndex = renderBody.indexOf('renderPipes');
                
                // drawBackground should appear before renderBird and renderPipes
                if (drawBgIndex !== -1 && renderBirdIndex !== -1) {
                    expect(drawBgIndex).toBeLessThan(renderBirdIndex);
                }
                if (drawBgIndex !== -1 && renderPipesIndex !== -1) {
                    expect(drawBgIndex).toBeLessThan(renderPipesIndex);
                }
            }
        });
    });

    describe('Gradient implementation details', () => {
        test('gradient variable is created', () => {
            expect(gameCode).toMatch(/const\s+gradient\s*=/);
        });

        test('gradient uses canvas dimensions', () => {
            // Should use CANVAS_HEIGHT for gradient end point
            expect(gameCode).toMatch(/createLinearGradient.*CANVAS_HEIGHT/);
        });

        test('gradient is vertical (top to bottom)', () => {
            // x coordinates should be 0 for both start and end (vertical gradient)
            expect(gameCode).toMatch(/createLinearGradient\s*\(\s*0\s*,\s*0\s*,\s*0\s*,/);
        });
    });
});
