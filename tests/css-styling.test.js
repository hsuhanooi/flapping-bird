/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F002: Base CSS Styling', () => {
    let cssContent;

    beforeAll(() => {
        // Load the CSS file
        const cssPath = path.join(__dirname, '..', 'styles.css');
        cssContent = fs.readFileSync(cssPath, 'utf8');
    });

    describe('CSS File Exists', () => {
        test('styles.css file exists', () => {
            const cssPath = path.join(__dirname, '..', 'styles.css');
            expect(fs.existsSync(cssPath)).toBe(true);
        });

        test('styles.css is not empty', () => {
            expect(cssContent.trim().length).toBeGreaterThan(0);
        });
    });

    describe('Reset Styles', () => {
        test('has universal selector reset for margin', () => {
            expect(cssContent).toMatch(/\*\s*\{[^}]*margin\s*:\s*0/);
        });

        test('has universal selector reset for padding', () => {
            expect(cssContent).toMatch(/\*\s*\{[^}]*padding\s*:\s*0/);
        });

        test('has box-sizing border-box', () => {
            expect(cssContent).toMatch(/box-sizing\s*:\s*border-box/);
        });
    });

    describe('Body Styling', () => {
        test('body has background-color defined', () => {
            expect(cssContent).toMatch(/body\s*\{[^}]*background-color\s*:/);
        });

        test('body has dark background color', () => {
            // Match common dark color patterns (hex starting with low values or named dark colors)
            const bodyMatch = cssContent.match(/body\s*\{([^}]*)\}/);
            expect(bodyMatch).toBeTruthy();
            const bodyContent = bodyMatch[1];
            expect(bodyContent).toMatch(/background-color\s*:\s*#[0-4][0-9a-fA-F]{5}/);
        });

        test('body uses flexbox for centering', () => {
            expect(cssContent).toMatch(/body\s*\{[^}]*display\s*:\s*flex/);
        });

        test('body has justify-content center', () => {
            expect(cssContent).toMatch(/body\s*\{[^}]*justify-content\s*:\s*center/);
        });

        test('body has align-items center', () => {
            expect(cssContent).toMatch(/body\s*\{[^}]*align-items\s*:\s*center/);
        });

        test('body has min-height 100vh for full viewport', () => {
            expect(cssContent).toMatch(/body\s*\{[^}]*min-height\s*:\s*100vh/);
        });

        test('body has overflow hidden to prevent scrollbars', () => {
            expect(cssContent).toMatch(/body\s*\{[^}]*overflow\s*:\s*hidden/);
        });
    });

    describe('Canvas Styling', () => {
        test('canvas has border for visibility', () => {
            expect(cssContent).toMatch(/#gameCanvas\s*\{[^}]*border\s*:/);
        });

        test('canvas has display block', () => {
            expect(cssContent).toMatch(/#gameCanvas\s*\{[^}]*display\s*:\s*block/);
        });
    });

    describe('Applied Styles in DOM', () => {
        let document;

        beforeEach(() => {
            // Load the HTML
            const htmlPath = path.join(__dirname, '..', 'index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');

            document = new DOMParser().parseFromString(htmlContent, 'text/html');

            // Create a style element with our CSS
            const style = document.createElement('style');
            style.textContent = cssContent;
            document.head.appendChild(style);
        });

        test('canvas element exists to receive styles', () => {
            const canvas = document.getElementById('gameCanvas');
            expect(canvas).toBeTruthy();
        });

        test('body element exists to receive styles', () => {
            expect(document.body).toBeTruthy();
        });
    });
});
