/**
 * Tests for F010: Add Velocity Cap
 * Tests that bird velocity is capped at maximum values
 */

const fs = require('fs');
const path = require('path');

describe('F010: Add Velocity Cap', () => {
    let gameJsContent;

    beforeAll(() => {
        // Read the game.js file
        const gamePath = path.join(__dirname, '..', 'game.js');
        gameJsContent = fs.readFileSync(gamePath, 'utf8');
    });

    describe('MAX_VELOCITY constant', () => {
        test('MAX_VELOCITY constant is defined', () => {
            expect(gameJsContent).toMatch(/const\s+MAX_VELOCITY\s*=/);
        });

        test('MAX_VELOCITY is set to 10', () => {
            expect(gameJsContent).toMatch(/const\s+MAX_VELOCITY\s*=\s*10/);
        });

        test('MAX_VELOCITY has a descriptive comment', () => {
            expect(gameJsContent).toMatch(/MAX_VELOCITY.*\/\//);
        });
    });

    describe('Velocity capping logic', () => {
        test('updateBird() contains downward velocity cap check', () => {
            expect(gameJsContent).toMatch(/bird\.velocity\s*>\s*MAX_VELOCITY/);
        });

        test('updateBird() caps velocity at MAX_VELOCITY', () => {
            expect(gameJsContent).toMatch(/bird\.velocity\s*=\s*MAX_VELOCITY/);
        });

        test('updateBird() contains upward velocity cap check', () => {
            expect(gameJsContent).toMatch(/bird\.velocity\s*<\s*FLAP_STRENGTH/);
        });

        test('updateBird() caps upward velocity at FLAP_STRENGTH', () => {
            // Verify there's logic to cap upward velocity
            const upwardCapMatch = gameJsContent.match(/if\s*\(\s*bird\.velocity\s*<\s*FLAP_STRENGTH\s*\)/);
            expect(upwardCapMatch).not.toBeNull();
        });
    });

    describe('Velocity cap behavior (simulation)', () => {
        let bird;
        let GRAVITY;
        let FLAP_STRENGTH;
        let MAX_VELOCITY;

        beforeEach(() => {
            // Extract constants from game.js
            const gravityMatch = gameJsContent.match(/const\s+GRAVITY\s*=\s*([\d.]+)/);
            const flapMatch = gameJsContent.match(/const\s+FLAP_STRENGTH\s*=\s*(-?[\d.]+)/);
            const maxVelMatch = gameJsContent.match(/const\s+MAX_VELOCITY\s*=\s*([\d.]+)/);

            GRAVITY = parseFloat(gravityMatch[1]);
            FLAP_STRENGTH = parseFloat(flapMatch[1]);
            MAX_VELOCITY = parseFloat(maxVelMatch[1]);

            // Create bird object
            bird = {
                x: 80,
                y: 300,
                velocity: 0
            };
        });

        // Simulate updateBird with velocity capping
        function updateBird() {
            bird.velocity += GRAVITY;

            if (bird.velocity > MAX_VELOCITY) {
                bird.velocity = MAX_VELOCITY;
            }

            if (bird.velocity < FLAP_STRENGTH) {
                bird.velocity = FLAP_STRENGTH;
            }

            bird.y += bird.velocity;
        }

        function flap() {
            bird.velocity = FLAP_STRENGTH;
        }

        test('bird velocity is capped at MAX_VELOCITY when falling', () => {
            // Simulate falling for many frames
            for (let i = 0; i < 100; i++) {
                updateBird();
            }

            expect(bird.velocity).toBe(MAX_VELOCITY);
            expect(bird.velocity).toBeLessThanOrEqual(10);
        });

        test('bird cannot fall faster than MAX_VELOCITY', () => {
            bird.velocity = 20; // Start with velocity higher than cap
            updateBird();

            expect(bird.velocity).toBe(MAX_VELOCITY);
        });

        test('bird velocity exactly at MAX_VELOCITY stays at MAX_VELOCITY', () => {
            bird.velocity = MAX_VELOCITY - GRAVITY; // Will become MAX_VELOCITY after gravity
            updateBird();

            expect(bird.velocity).toBe(MAX_VELOCITY);
        });

        test('bird cannot fly faster than FLAP_STRENGTH upward', () => {
            bird.velocity = -15; // Start with velocity more negative than FLAP_STRENGTH
            updateBird();

            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('flap sets velocity to exactly FLAP_STRENGTH', () => {
            bird.velocity = 5; // Start falling
            flap();

            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('velocity cap does not affect normal upward movement from flap', () => {
            flap();
            expect(bird.velocity).toBe(FLAP_STRENGTH);

            // After one frame, velocity should be FLAP_STRENGTH + GRAVITY
            updateBird();
            expect(bird.velocity).toBe(FLAP_STRENGTH + GRAVITY);
        });

        test('multiple flaps do not exceed FLAP_STRENGTH', () => {
            // Even with multiple rapid flaps, velocity should not exceed FLAP_STRENGTH
            for (let i = 0; i < 5; i++) {
                flap();
            }

            expect(bird.velocity).toBe(FLAP_STRENGTH);
        });

        test('velocity smoothly reaches terminal velocity', () => {
            const velocities = [];

            // Track velocity over many frames
            for (let i = 0; i < 50; i++) {
                updateBird();
                velocities.push(bird.velocity);
            }

            // Velocity should increase until it reaches MAX_VELOCITY
            const finalVelocity = velocities[velocities.length - 1];
            expect(finalVelocity).toBe(MAX_VELOCITY);

            // Early velocities should be smaller
            expect(velocities[0]).toBeLessThan(MAX_VELOCITY);
        });

        test('capping happens after gravity is applied but before position update', () => {
            bird.velocity = MAX_VELOCITY - 0.1; // Just under the cap
            const initialY = bird.y;

            updateBird();

            // Velocity should have been capped at MAX_VELOCITY (not MAX_VELOCITY + GRAVITY - 0.1)
            expect(bird.velocity).toBe(MAX_VELOCITY);

            // Position should have been updated by the capped velocity
            expect(bird.y).toBe(initialY + MAX_VELOCITY);
        });

        test('constants have correct relationship (MAX_VELOCITY > 0 and FLAP_STRENGTH < 0)', () => {
            expect(MAX_VELOCITY).toBeGreaterThan(0);
            expect(FLAP_STRENGTH).toBeLessThan(0);
        });

        test('MAX_VELOCITY and FLAP_STRENGTH provide good gameplay range', () => {
            // MAX_VELOCITY should be reasonably greater than FLAP_STRENGTH magnitude
            // This ensures the bird can fly up effectively but also falls at a reasonable speed
            expect(MAX_VELOCITY).toBeGreaterThanOrEqual(Math.abs(FLAP_STRENGTH));
        });
    });

    describe('Code structure', () => {
        test('velocity capping is inside updateBird function', () => {
            // Find updateBird function and check it contains velocity capping
            const updateBirdMatch = gameJsContent.match(/function\s+updateBird\s*\(\s*\)\s*\{[\s\S]*?(?=function\s+\w+\s*\(|const\s+\w+\s*=|$)/);
            expect(updateBirdMatch).not.toBeNull();

            const updateBirdContent = updateBirdMatch[0];
            expect(updateBirdContent).toMatch(/MAX_VELOCITY/);
            expect(updateBirdContent).toMatch(/FLAP_STRENGTH/);
        });

        test('gravity is applied before velocity capping', () => {
            // The order should be: gravity -> cap -> position update
            const updateBirdMatch = gameJsContent.match(/function\s+updateBird[\s\S]*?bird\.y\s*\+=\s*bird\.velocity/);
            expect(updateBirdMatch).not.toBeNull();

            const updateBirdContent = updateBirdMatch[0];

            const gravityIndex = updateBirdContent.indexOf('bird.velocity += GRAVITY');
            const capIndex = updateBirdContent.indexOf('MAX_VELOCITY');
            const positionIndex = updateBirdContent.indexOf('bird.y += bird.velocity');

            expect(gravityIndex).toBeLessThan(capIndex);
            expect(capIndex).toBeLessThan(positionIndex);
        });
    });
});
