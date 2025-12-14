module.exports = {
  rootDir: '../',
  roots: ['<rootDir>/public', '<rootDir>/server', '<rootDir>/common'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  collectCoverageFrom: [
    '<rootDir>/public/**/*.{ts,tsx}',
    '<rootDir>/server/**/*.ts',
    '<rootDir>/common/**/*.ts',
    '!**/*.test.{ts,tsx}',
    '!**/node_modules/**',
    '!**/target/**',
  ],
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/test/setup_tests.ts'],
  coverageDirectory: '<rootDir>/target/coverage',
  coverageReporters: ['html', 'text', 'text-summary'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/test/__mocks__/style_mock.ts',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': '@osd/test/target/jest/babel_transform.js',
  },
};
