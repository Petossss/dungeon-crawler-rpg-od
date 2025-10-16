module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text-summary'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};
