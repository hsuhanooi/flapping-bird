module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  moduleFileExtensions: ['js'],
  collectCoverageFrom: ['*.js', '!jest.config.js'],
  coverageDirectory: 'coverage',
  verbose: true
};
