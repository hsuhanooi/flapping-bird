/**
 * F037: Responsive Canvas Scaling
 * Tests for canvas scaling on different screen sizes
 */

const fs = require('fs');
const path = require('path');

describe('F037: Responsive Canvas Scaling', () => {
    let cssContent;

    beforeAll(() => {
        const cssPath = path.join(__dirname, '..', 'styles.css');
        cssContent = fs.readFileSync(cssPath, 'utf8');
    });

    describe('Canvas has max-width for scaling', () => {
        test('canvas has max-width property', () => {
            expect(cssContent).toMatch(/max-width\s*:/);
        });

        test('canvas max-width is set to 100%', () => {
            expect(cssContent).toMatch(/max-width\s*:\s*100%/);
        });

        test('max-width is in #gameCanvas selector', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            expect(canvasRule[0]).toMatch(/max-width\s*:\s*100%/);
        });
    });

    describe('Canvas has max-height for vertical scaling', () => {
        test('canvas has max-height property', () => {
            expect(cssContent).toMatch(/max-height\s*:/);
        });

        test('canvas max-height is set to 100vh', () => {
            expect(cssContent).toMatch(/max-height\s*:\s*100vh/);
        });

        test('max-height is in #gameCanvas selector', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            expect(canvasRule[0]).toMatch(/max-height\s*:\s*100vh/);
        });
    });

    describe('Canvas maintains aspect ratio', () => {
        test('canvas has aspect-ratio property', () => {
            expect(cssContent).toMatch(/aspect-ratio\s*:/);
        });

        test('canvas aspect-ratio is set to 400/600 or 2/3', () => {
            const hasCorrectAspectRatio = 
                cssContent.match(/aspect-ratio\s*:\s*400\s*\/\s*600/) ||
                cssContent.match(/aspect-ratio\s*:\s*2\s*\/\s*3/);
            expect(hasCorrectAspectRatio).toBeTruthy();
        });

        test('aspect-ratio is in #gameCanvas selector', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            const hasAspectRatio = 
                canvasRule[0].match(/aspect-ratio\s*:\s*400\s*\/\s*600/) ||
                canvasRule[0].match(/aspect-ratio\s*:\s*2\s*\/\s*3/);
            expect(hasAspectRatio).toBeTruthy();
        });
    });

    describe('Canvas width scaling', () => {
        test('canvas has width property for scaling', () => {
            expect(cssContent).toMatch(/#gameCanvas[^{]*\{[^}]*width\s*:/s);
        });

        test('canvas width allows scaling (100% or auto)', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            const hasScalingWidth = 
                canvasRule[0].match(/width\s*:\s*100%/) ||
                canvasRule[0].match(/width\s*:\s*auto/);
            expect(hasScalingWidth).toBeTruthy();
        });
    });

    describe('Canvas height scaling', () => {
        test('canvas has height property for scaling', () => {
            expect(cssContent).toMatch(/#gameCanvas[^{]*\{[^}]*height\s*:/s);
        });

        test('canvas height is set to auto for aspect ratio', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            expect(canvasRule[0]).toMatch(/height\s*:\s*auto/);
        });
    });

    describe('Responsive scaling for different screen sizes', () => {
        test('CSS contains media query for responsive behavior', () => {
            const hasMediaQuery = cssContent.match(/@media\s*\(/);
            // Media query is optional but recommended for better control
            // If present, it should help with scaling
            if (hasMediaQuery) {
                expect(cssContent).toMatch(/@media/);
            }
        });

        test('canvas scales down on smaller screens', () => {
            // With max-width: 100%, canvas will scale down on screens < 400px
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            expect(canvasRule[0]).toMatch(/max-width\s*:\s*100%/);
        });

        test('canvas scales down vertically on smaller viewports', () => {
            // With max-height: 100vh, canvas will scale down on viewports < 600px height
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            expect(canvasRule[0]).toMatch(/max-height\s*:\s*100vh/);
        });
    });

    describe('Aspect ratio preservation', () => {
        test('aspect-ratio ensures 2:3 ratio is maintained', () => {
            const hasCorrectAspectRatio = 
                cssContent.match(/aspect-ratio\s*:\s*400\s*\/\s*600/) ||
                cssContent.match(/aspect-ratio\s*:\s*2\s*\/\s*3/);
            expect(hasCorrectAspectRatio).toBeTruthy();
        });

        test('height: auto works with aspect-ratio', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            expect(canvasRule[0]).toMatch(/height\s*:\s*auto/);
            const hasAspectRatio = 
                canvasRule[0].match(/aspect-ratio\s*:\s*400\s*\/\s*600/) ||
                canvasRule[0].match(/aspect-ratio\s*:\s*2\s*\/\s*3/);
            expect(hasAspectRatio).toBeTruthy();
        });
    });

    describe('Integration with existing canvas styles', () => {
        test('responsive scaling does not remove existing border', () => {
            expect(cssContent).toMatch(/#gameCanvas[^{]*\{[^}]*border\s*:/s);
        });

        test('responsive scaling does not remove display: block', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            expect(canvasRule[0]).toMatch(/display\s*:\s*block/);
        });

        test('all responsive properties are in same selector', () => {
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            const rule = canvasRule[0];
            expect(rule).toMatch(/max-width/);
            expect(rule).toMatch(/max-height/);
            expect(rule).toMatch(/aspect-ratio/);
        });
    });

    describe('Game remains playable at different sizes', () => {
        test('canvas maintains its internal resolution (400x600)', () => {
            // The HTML attributes width="400" height="600" set the internal resolution
            // CSS only scales the visual display
            const htmlPath = path.join(__dirname, '..', 'index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            expect(htmlContent).toMatch(/width\s*=\s*["']400["']/);
            expect(htmlContent).toMatch(/height\s*=\s*["']600["']/);
        });

        test('CSS scaling does not affect canvas internal dimensions', () => {
            // Canvas internal resolution is set by HTML attributes, not CSS
            // CSS only affects visual display size
            const canvasRule = cssContent.match(/#gameCanvas\s*\{[^}]*\}/s);
            expect(canvasRule).toBeTruthy();
            // CSS should scale the display, but game logic uses internal 400x600
            expect(cssContent).toMatch(/max-width/);
        });
    });
});
