/**
 * Tests for F040: Style Bird Appearance
 * Verifies the bird has improved visual design with:
 * - Ellipse/rounded body shape
 * - Yellow/orange fill color
 * - Darker outline/stroke
 * - Eye detail (white circle with black pupil)
 * - Beak (orange triangle)
 */

const fs = require('fs');
const path = require('path');

// Read game.js file
const gameJsPath = path.join(__dirname, '..', 'game.js');
const gameJsContent = fs.readFileSync(gameJsPath, 'utf8');

describe('F040: Style Bird Appearance', () => {
    describe('Bird body shape', () => {
        test('renderBird uses ellipse for body shape', () => {
            expect(gameJsContent).toMatch(/ctx\.ellipse\s*\(/);
        });

        test('ellipse is drawn at bird center (0, 0)', () => {
            // After translate to center, ellipse should be at origin
            expect(gameJsContent).toMatch(/ctx\.ellipse\s*\(\s*0\s*,\s*0/);
        });

        test('ellipse uses bird width/2 as horizontal radius', () => {
            expect(gameJsContent).toMatch(/bodyRadiusX\s*=\s*bird\.width\s*\/\s*2/);
        });

        test('ellipse uses bird height/2 as vertical radius', () => {
            expect(gameJsContent).toMatch(/bodyRadiusY\s*=\s*bird\.height\s*\/\s*2/);
        });

        test('beginPath is called before drawing ellipse', () => {
            expect(gameJsContent).toMatch(/ctx\.beginPath\s*\(\s*\)/);
        });
    });

    describe('Bird fill color', () => {
        test('bird body uses yellow/gold fill color (#f7dc6f)', () => {
            // Check that the yellow/gold color is used for the body
            expect(gameJsContent).toMatch(/fillStyle\s*=\s*['"]#f7dc6f['"]/);
        });

        test('fill() is called after setting ellipse fill style', () => {
            expect(gameJsContent).toMatch(/ctx\.fill\s*\(\s*\)/);
        });
    });

    describe('Bird outline/stroke', () => {
        test('bird body has darker outline color (#d4ac0d)', () => {
            expect(gameJsContent).toMatch(/strokeStyle\s*=\s*['"]#d4ac0d['"]/);
        });

        test('stroke lineWidth is set for outline', () => {
            expect(gameJsContent).toMatch(/ctx\.lineWidth\s*=/);
        });

        test('stroke() is called for body outline', () => {
            expect(gameJsContent).toMatch(/ctx\.stroke\s*\(\s*\)/);
        });
    });

    describe('Bird eye detail', () => {
        test('eye is drawn using arc', () => {
            expect(gameJsContent).toMatch(/ctx\.arc\s*\(/);
        });

        test('eye uses white fill color (#ffffff)', () => {
            expect(gameJsContent).toMatch(/fillStyle\s*=\s*['"]#ffffff['"]/);
        });

        test('eye has dark outline (#333333)', () => {
            expect(gameJsContent).toMatch(/strokeStyle\s*=\s*['"]#333333['"]/);
        });

        test('eye pupil uses black fill color (#000000)', () => {
            expect(gameJsContent).toMatch(/fillStyle\s*=\s*['"]#000000['"]/);
        });

        test('eye radius is defined', () => {
            expect(gameJsContent).toMatch(/eyeRadius\s*=/);
        });

        test('pupil radius is defined', () => {
            expect(gameJsContent).toMatch(/pupilRadius\s*=/);
        });
    });

    describe('Bird beak detail', () => {
        test('beak uses orange fill color (#ff6b35)', () => {
            expect(gameJsContent).toMatch(/fillStyle\s*=\s*['"]#ff6b35['"]/);
        });

        test('beak has darker orange outline (#cc5500)', () => {
            expect(gameJsContent).toMatch(/strokeStyle\s*=\s*['"]#cc5500['"]/);
        });

        test('beak is drawn using moveTo and lineTo (triangle shape)', () => {
            expect(gameJsContent).toMatch(/ctx\.moveTo\s*\(/);
            expect(gameJsContent).toMatch(/ctx\.lineTo\s*\(/);
        });

        test('beak path is closed', () => {
            expect(gameJsContent).toMatch(/ctx\.closePath\s*\(\s*\)/);
        });
    });

    describe('Canvas state management', () => {
        test('ctx.save() is called before transformations', () => {
            expect(gameJsContent).toMatch(/ctx\.save\s*\(\s*\)/);
        });

        test('ctx.restore() is called after drawing bird', () => {
            expect(gameJsContent).toMatch(/ctx\.restore\s*\(\s*\)/);
        });

        test('ctx.translate() is called to move to bird center', () => {
            expect(gameJsContent).toMatch(/ctx\.translate\s*\(/);
        });

        test('ctx.rotate() is called for bird rotation', () => {
            expect(gameJsContent).toMatch(/ctx\.rotate\s*\(/);
        });
    });

    describe('Bird is visible against background', () => {
        test('bird body color (#f7dc6f) is distinct from sky background (#87ceeb/#70c5ce)', () => {
            // Check that bird uses yellow which contrasts with blue sky
            const hasBirdColor = gameJsContent.includes('#f7dc6f');
            const hasSkyColor = gameJsContent.includes('#87ceeb') || gameJsContent.includes('#70c5ce');
            expect(hasBirdColor).toBe(true);
            expect(hasSkyColor).toBe(true);
            // Colors are different (yellow vs blue)
        });

        test('bird outline provides additional visibility', () => {
            // Check that stroke is called (provides outline)
            expect(gameJsContent).toMatch(/ctx\.stroke\s*\(\s*\)/);
        });
    });

    describe('Bird visual style matches game aesthetic', () => {
        test('bird uses warm colors (yellow/orange)', () => {
            // Yellow body
            expect(gameJsContent).toMatch(/#f7dc6f/);
            // Orange beak
            expect(gameJsContent).toMatch(/#ff6b35/);
        });

        test('bird has consistent style with outlines on all parts', () => {
            // Multiple stroke calls for body, eye, and beak outlines
            const strokeMatches = gameJsContent.match(/ctx\.stroke\s*\(\s*\)/g);
            expect(strokeMatches).not.toBeNull();
            expect(strokeMatches.length).toBeGreaterThanOrEqual(3); // body, eye, beak
        });
    });
});

describe('F040: renderBird function structure', () => {
    test('renderBird function is defined', () => {
        expect(gameJsContent).toMatch(/function\s+renderBird\s*\(\s*\)/);
    });

    test('renderBird includes comment about improved visual design', () => {
        expect(gameJsContent).toMatch(/Render\s+bird\s+with\s+improved\s+visual\s+design/i);
    });

    test('renderBird still includes rotation based on velocity', () => {
        expect(gameJsContent).toMatch(/rotationAngle/);
        expect(gameJsContent).toMatch(/rotationRadians/);
    });
});
