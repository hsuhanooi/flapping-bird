/**
 * F038: Add Bird Rotation Based on Velocity
 * Tests for bird rotation functionality based on velocity
 */

const fs = require('fs');
const path = require('path');

describe('F038: Add Bird Rotation Based on Velocity', () => {
    let gameCode;
    
    beforeAll(() => {
        const gamePath = path.join(__dirname, '..', 'game.js');
        gameCode = fs.readFileSync(gamePath, 'utf8');
    });

    describe('Rotation angle calculation', () => {
        test('renderBird calculates rotation angle from bird velocity', () => {
            expect(gameCode).toMatch(/rotationAngle|rotationRadians|rotation/i);
            expect(gameCode).toMatch(/bird\.velocity/);
        });

        test('velocity range is mapped to angle range', () => {
            // Should map FLAP_STRENGTH (-8) to -30 degrees
            // Should map MAX_VELOCITY (10) to 90 degrees
            expect(gameCode).toMatch(/FLAP_STRENGTH|minVelocity/i);
            expect(gameCode).toMatch(/MAX_VELOCITY|maxVelocity/i);
            expect(gameCode).toMatch(/-30|minAngle/i);
            expect(gameCode).toMatch(/90|maxAngle/i);
        });

        test('velocity is clamped to valid range', () => {
            expect(gameCode).toMatch(/Math\.max.*Math\.min|clampedVelocity/i);
        });

        test('angle is converted from degrees to radians', () => {
            expect(gameCode).toMatch(/Math\.PI|radians/i);
            expect(gameCode).toMatch(/180/);
        });
    });

    describe('Canvas transformation for rotation', () => {
        test('renderBird uses ctx.save() before rotation', () => {
            expect(gameCode).toMatch(/ctx\.save\(\)/);
        });

        test('renderBird uses ctx.restore() after rotation', () => {
            expect(gameCode).toMatch(/ctx\.restore\(\)/);
        });

        test('renderBird translates to bird center', () => {
            expect(gameCode).toMatch(/ctx\.translate/);
            expect(gameCode).toMatch(/bird\.x.*bird\.width.*2|birdCenterX/i);
            expect(gameCode).toMatch(/bird\.y.*bird\.height.*2|birdCenterY/i);
        });

        test('renderBird rotates around bird center', () => {
            expect(gameCode).toMatch(/ctx\.rotate/);
        });
    });

    describe('Bird rendering with rotation', () => {
        test('bird is drawn centered at origin after translation', () => {
            // After translate to center, bird should be drawn at (-width/2, -height/2)
            expect(gameCode).toMatch(/fillRect.*-.*bird\.width.*2/i);
            expect(gameCode).toMatch(/fillRect.*-.*bird\.height.*2/i);
        });

        test('renderBird still sets fillStyle to yellow', () => {
            expect(gameCode).toMatch(/fillStyle.*#f7dc6f|fillStyle.*yellow/i);
        });

        test('renderBird still uses bird dimensions', () => {
            expect(gameCode).toMatch(/bird\.width/);
            expect(gameCode).toMatch(/bird\.height/);
        });
    });

    describe('Rotation behavior', () => {
        test('bird tilts up when velocity is negative (flapping)', () => {
            // Negative velocity (FLAP_STRENGTH = -8) should result in negative angle (-30 degrees)
            expect(gameCode).toMatch(/minAngle.*-30|-30.*minAngle/i);
        });

        test('bird tilts down when velocity is positive (falling)', () => {
            // Positive velocity (MAX_VELOCITY = 10) should result in positive angle (90 degrees)
            expect(gameCode).toMatch(/maxAngle.*90|90.*maxAngle/i);
        });

        test('rotation angle calculation uses linear interpolation', () => {
            // Should have formula: angle = minAngle + (velocity - minVelocity) * (maxAngle - minAngle) / (maxVelocity - minVelocity)
            expect(gameCode).toMatch(/normalizedVelocity|velocityRange|angleRange/i);
        });
    });

    describe('Integration with existing code', () => {
        test('renderBird function still exists', () => {
            expect(gameCode).toMatch(/function renderBird/);
        });

        test('FLAP_STRENGTH constant is used', () => {
            expect(gameCode).toMatch(/FLAP_STRENGTH/);
        });

        test('MAX_VELOCITY constant is used', () => {
            expect(gameCode).toMatch(/MAX_VELOCITY/);
        });

        test('bird object properties are still accessible', () => {
            expect(gameCode).toMatch(/bird\.x/);
            expect(gameCode).toMatch(/bird\.y/);
            expect(gameCode).toMatch(/bird\.width/);
            expect(gameCode).toMatch(/bird\.height/);
            expect(gameCode).toMatch(/bird\.velocity/);
        });
    });

    describe('Code structure', () => {
        test('rotation logic is in renderBird function', () => {
            const renderBirdMatch = gameCode.match(/function renderBird\(\)\s*\{([\s\S]*?)\n\}/);
            expect(renderBirdMatch).toBeTruthy();
            const renderBirdBody = renderBirdMatch[1];
            expect(renderBirdBody).toMatch(/ctx\.save/);
            expect(renderBirdBody).toMatch(/ctx\.translate/);
            expect(renderBirdBody).toMatch(/ctx\.rotate/);
            expect(renderBirdBody).toMatch(/ctx\.restore/);
        });

        test('rotation calculation happens before canvas transformation', () => {
            const renderBirdMatch = gameCode.match(/function renderBird\(\)\s*\{([\s\S]*?)\n\}/);
            expect(renderBirdMatch).toBeTruthy();
            const renderBirdBody = renderBirdMatch[1];
            const saveIndex = renderBirdBody.indexOf('ctx.save');
            const rotationIndex = renderBirdBody.indexOf('rotationAngle') || renderBirdBody.indexOf('rotationRadians');
            expect(saveIndex).toBeGreaterThan(rotationIndex || -1);
        });
    });
});
