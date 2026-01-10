/**
 * F036: Add Mobile Viewport Meta
 * Tests for mobile viewport meta tag configuration
 */

const fs = require('fs');
const path = require('path');

describe('F036: Add Mobile Viewport Meta', () => {
    let htmlContent;

    beforeAll(() => {
        const htmlPath = path.join(__dirname, '..', 'index.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf8');
    });

    describe('Viewport meta tag existence', () => {
        test('viewport meta tag exists in HTML head', () => {
            expect(htmlContent).toMatch(/<meta\s+name=["']viewport["']/i);
        });

        test('viewport meta tag is in head section', () => {
            const headMatch = htmlContent.match(/<head>[\s\S]*?<\/head>/i);
            expect(headMatch).toBeTruthy();
            expect(headMatch[0]).toMatch(/<meta\s+name=["']viewport["']/i);
        });
    });

    describe('Viewport meta tag configuration', () => {
        test('viewport meta tag has width=device-width', () => {
            expect(htmlContent).toMatch(/width\s*=\s*device-width/i);
        });

        test('viewport meta tag has initial-scale=1.0', () => {
            expect(htmlContent).toMatch(/initial-scale\s*=\s*1\.0/i);
        });

        test('viewport meta tag has maximum-scale=1.0', () => {
            expect(htmlContent).toMatch(/maximum-scale\s*=\s*1\.0/i);
        });

        test('viewport meta tag has user-scalable=no', () => {
            expect(htmlContent).toMatch(/user-scalable\s*=\s*no/i);
        });

        test('viewport meta tag contains all required attributes', () => {
            const viewportMatch = htmlContent.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i);
            expect(viewportMatch).toBeTruthy();
            const content = viewportMatch[1];
            expect(content).toMatch(/width\s*=\s*device-width/i);
            expect(content).toMatch(/initial-scale\s*=\s*1\.0/i);
            expect(content).toMatch(/maximum-scale\s*=\s*1\.0/i);
            expect(content).toMatch(/user-scalable\s*=\s*no/i);
        });
    });

    describe('Viewport meta tag format', () => {
        test('viewport meta tag uses correct attribute format', () => {
            expect(htmlContent).toMatch(/<meta\s+name=["']viewport["']\s+content=["'][^"']+["']/i);
        });

        test('viewport meta tag content is properly formatted', () => {
            const viewportMatch = htmlContent.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i);
            expect(viewportMatch).toBeTruthy();
            const content = viewportMatch[1];
            // Content should be a comma-separated list
            expect(content).toContain(',');
        });
    });

    describe('Mobile viewport behavior', () => {
        test('viewport prevents zoom with maximum-scale=1.0', () => {
            expect(htmlContent).toMatch(/maximum-scale\s*=\s*1\.0/i);
        });

        test('viewport prevents pinch-to-zoom with user-scalable=no', () => {
            expect(htmlContent).toMatch(/user-scalable\s*=\s*no/i);
        });

        test('viewport scales to device width', () => {
            expect(htmlContent).toMatch(/width\s*=\s*device-width/i);
        });

        test('viewport uses initial scale of 1.0', () => {
            expect(htmlContent).toMatch(/initial-scale\s*=\s*1\.0/i);
        });
    });
});
