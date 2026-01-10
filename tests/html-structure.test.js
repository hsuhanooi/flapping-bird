/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('F001: HTML Structure', () => {
    let htmlContent;

    beforeAll(() => {
        // Read the HTML file
        const htmlPath = path.join(__dirname, '..', 'index.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf8');

        // Parse HTML into DOM using jsdom's document
        document.body.innerHTML = '';
        document.documentElement.innerHTML = htmlContent.replace(/<!DOCTYPE html>/i, '');
    });

    test('index.html file exists', () => {
        const htmlPath = path.join(__dirname, '..', 'index.html');
        expect(fs.existsSync(htmlPath)).toBe(true);
    });

    test('has valid HTML5 doctype', () => {
        expect(htmlContent.toLowerCase()).toMatch(/<!doctype html>/i);
    });

    test('has html element with lang attribute', () => {
        expect(htmlContent).toMatch(/<html[^>]*lang=/);
    });

    test('has head element with meta charset', () => {
        expect(htmlContent).toMatch(/<meta[^>]*charset/i);
    });

    test('has canvas element with id "gameCanvas"', () => {
        const canvas = document.getElementById('gameCanvas');
        expect(canvas).not.toBeNull();
        expect(canvas.tagName.toLowerCase()).toBe('canvas');
    });

    test('canvas has width of 400px', () => {
        const canvas = document.getElementById('gameCanvas');
        expect(canvas.getAttribute('width')).toBe('400');
    });

    test('canvas has height of 600px', () => {
        const canvas = document.getElementById('gameCanvas');
        expect(canvas.getAttribute('height')).toBe('600');
    });

    test('links to styles.css', () => {
        expect(htmlContent).toMatch(/<link[^>]*href=["']styles\.css["']/);
    });

    test('links to game.js', () => {
        expect(htmlContent).toMatch(/<script[^>]*src=["']game\.js["']/);
    });

    test('styles.css file exists', () => {
        const cssPath = path.join(__dirname, '..', 'styles.css');
        expect(fs.existsSync(cssPath)).toBe(true);
    });

    test('game.js file exists', () => {
        const jsPath = path.join(__dirname, '..', 'game.js');
        expect(fs.existsSync(jsPath)).toBe(true);
    });
});
