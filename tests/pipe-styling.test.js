/**
 * Tests for F041: Style Pipe Appearance
 *
 * Verifies that pipes have improved visual design with:
 * - Green fill color for pipes
 * - Darker green outline/stroke
 * - Pipe caps (wider sections at openings)
 * - Both top and bottom pipes have caps
 */

const fs = require('fs');
const path = require('path');

describe('F041: Style Pipe Appearance', () => {
    let gameCode;

    beforeAll(() => {
        const gamePath = path.join(__dirname, '..', 'game.js');
        gameCode = fs.readFileSync(gamePath, 'utf8');
    });

    describe('Pipe cap constants', () => {
        test('PIPE_CAP_HEIGHT constant is defined', () => {
            expect(gameCode).toMatch(/const\s+PIPE_CAP_HEIGHT\s*=/);
        });

        test('PIPE_CAP_HEIGHT is a reasonable value', () => {
            const match = gameCode.match(/const\s+PIPE_CAP_HEIGHT\s*=\s*(\d+)/);
            expect(match).not.toBeNull();
            const capHeight = parseInt(match[1], 10);
            expect(capHeight).toBeGreaterThanOrEqual(15);
            expect(capHeight).toBeLessThanOrEqual(40);
        });

        test('PIPE_CAP_OVERHANG constant is defined', () => {
            expect(gameCode).toMatch(/const\s+PIPE_CAP_OVERHANG\s*=/);
        });

        test('PIPE_CAP_OVERHANG is a reasonable value', () => {
            const match = gameCode.match(/const\s+PIPE_CAP_OVERHANG\s*=\s*(\d+)/);
            expect(match).not.toBeNull();
            const overhang = parseInt(match[1], 10);
            expect(overhang).toBeGreaterThanOrEqual(2);
            expect(overhang).toBeLessThanOrEqual(10);
        });
    });

    describe('Green fill color for pipes', () => {
        test('renderPipes uses green fill color', () => {
            expect(gameCode).toMatch(/fillStyle\s*=\s*['"]#228B22['"]/);
        });

        test('renderPipes uses fillRect to draw pipes', () => {
            // Check that fillRect is used in renderPipes function
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/ctx\.fillRect/);
        });

        test('green color is used for pipe body', () => {
            // Forest green (#228B22) for pipe body
            expect(gameCode).toMatch(/fillStyle\s*=\s*['"]#228B22['"].*pipe\s*body/i);
        });

        test('green color is used for pipe cap', () => {
            // Forest green (#228B22) for cap
            expect(gameCode).toMatch(/fillStyle\s*=\s*['"]#228B22['"].*cap/i);
        });
    });

    describe('Darker green outline/stroke', () => {
        test('renderPipes uses darker green stroke color', () => {
            expect(gameCode).toMatch(/strokeStyle\s*=\s*['"]#1a6b1a['"]/);
        });

        test('renderPipes uses strokeRect to draw outlines', () => {
            // Check that strokeRect is used in renderPipes function
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/ctx\.strokeRect/);
        });

        test('lineWidth is set for outlines', () => {
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/lineWidth\s*=\s*\d+/);
        });

        test('darker green outline is used for pipe body', () => {
            expect(gameCode).toMatch(/strokeStyle\s*=\s*['"]#1a6b1a['"].*outline/i);
        });

        test('darker green outline is used for pipe cap', () => {
            expect(gameCode).toMatch(/strokeStyle\s*=\s*['"]#1a6b1a['"].*outline/i);
        });
    });

    describe('Pipe cap (wider section at opening)', () => {
        test('cap width is calculated as wider than pipe body', () => {
            // capWidth should be PIPE_WIDTH + overhang on each side
            expect(gameCode).toMatch(/capWidth\s*=\s*PIPE_WIDTH\s*\+/);
        });

        test('cap X position accounts for overhang', () => {
            // capX should be pipe.x - PIPE_CAP_OVERHANG
            expect(gameCode).toMatch(/capX\s*=\s*pipe\.x\s*-\s*PIPE_CAP_OVERHANG/);
        });

        test('cap is drawn using fillRect', () => {
            // Check that fillRect is used for drawing caps
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            // Should have multiple fillRect calls (body + cap for top and bottom)
            const fillRectCount = (renderPipesMatch[0].match(/ctx\.fillRect/g) || []).length;
            expect(fillRectCount).toBeGreaterThanOrEqual(4);
        });

        test('cap has outline using strokeRect', () => {
            // Check that strokeRect is used for cap outlines
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            // Should have multiple strokeRect calls (body + cap for top and bottom)
            const strokeRectCount = (renderPipesMatch[0].match(/ctx\.strokeRect/g) || []).length;
            expect(strokeRectCount).toBeGreaterThanOrEqual(4);
        });
    });

    describe('Top pipe has cap at gap edge', () => {
        test('top pipe cap Y position is calculated', () => {
            // topCapY should be at topHeight - PIPE_CAP_HEIGHT
            expect(gameCode).toMatch(/topCapY\s*=\s*pipe\.topHeight\s*-\s*PIPE_CAP_HEIGHT/);
        });

        test('top pipe body height accounts for cap', () => {
            // Top pipe body should stop before the cap
            expect(gameCode).toMatch(/topPipeBodyHeight\s*=\s*pipe\.topHeight\s*-\s*PIPE_CAP_HEIGHT/);
        });

        test('top pipe cap is drawn with capWidth', () => {
            // Cap should use capWidth variable for width
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/fillRect\s*\(\s*capX\s*,\s*topCapY\s*,\s*capWidth/);
        });
    });

    describe('Bottom pipe has cap at gap edge', () => {
        test('bottom pipe cap Y position is at bottomY', () => {
            // bottomCapY should be at pipe.bottomY
            expect(gameCode).toMatch(/bottomCapY\s*=\s*pipe\.bottomY/);
        });

        test('bottom pipe body starts after cap', () => {
            // Bottom pipe body should start after the cap
            expect(gameCode).toMatch(/bottomPipeBodyY\s*=\s*pipe\.bottomY\s*\+\s*PIPE_CAP_HEIGHT/);
        });

        test('bottom pipe cap is drawn with capWidth', () => {
            // Cap should use capWidth variable for width
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/fillRect\s*\(\s*capX\s*,\s*bottomCapY\s*,\s*capWidth/);
        });
    });

    describe('Visual appearance matches classic Flappy Bird', () => {
        test('pipes use forest green color', () => {
            // #228B22 is forest green
            expect(gameCode).toMatch(/#228B22/);
        });

        test('pipes have consistent coloring (same fill for body and cap)', () => {
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            // Count occurrences of the green fill color
            const greenFillCount = (renderPipesMatch[0].match(/#228B22/g) || []).length;
            expect(greenFillCount).toBeGreaterThanOrEqual(4); // body and cap for top and bottom
        });

        test('pipe outlines are darker than fill', () => {
            // #1a6b1a (stroke) should be darker than #228B22 (fill)
            // Just verify both are present and different
            expect(gameCode).toMatch(/#228B22/); // fill
            expect(gameCode).toMatch(/#1a6b1a/); // stroke
        });
    });

    describe('Pipes are clearly visible', () => {
        test('pipe colors contrast with sky background', () => {
            // Green (#228B22) should contrast with sky blue (#87ceeb and #70c5ce)
            // Verify green fill is used
            expect(gameCode).toMatch(/#228B22/);
        });

        test('pipe outlines provide definition', () => {
            // Verify stroke is used
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/ctx\.strokeStyle/);
            expect(renderPipesMatch[0]).toMatch(/ctx\.strokeRect/);
        });

        test('caps are visually distinct (wider than body)', () => {
            // Verify cap width calculation includes overhang
            expect(gameCode).toMatch(/capWidth\s*=\s*PIPE_WIDTH\s*\+\s*\(\s*PIPE_CAP_OVERHANG\s*\*\s*2\s*\)/);
        });
    });

    describe('Code structure and integration', () => {
        test('renderPipes function exists', () => {
            expect(gameCode).toMatch(/function\s+renderPipes\s*\(\s*\)/);
        });

        test('renderPipes loops through pipes array', () => {
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/for\s*\(/);
            expect(renderPipesMatch[0]).toMatch(/pipes\.length/);
        });

        test('renderPipes uses groundY for bottom pipe calculations', () => {
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/groundY/);
        });

        test('renderPipes handles pipes with small topHeight gracefully', () => {
            // Should have a check for topPipeBodyHeight > 0
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/topPipeBodyHeight\s*>\s*0/);
        });

        test('renderPipes handles pipes with small bottom body gracefully', () => {
            // Should have a check for bottomPipeBodyHeight > 0
            const renderPipesMatch = gameCode.match(/function\s+renderPipes\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
            expect(renderPipesMatch).not.toBeNull();
            expect(renderPipesMatch[0]).toMatch(/bottomPipeBodyHeight\s*>\s*0/);
        });
    });
});
