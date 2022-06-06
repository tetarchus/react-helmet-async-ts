module.exports = {
  testEnvironment: 'jsdom',
  transform: { '\\.(ts|js)x?$': 'ts-jest' },
  testMatch: ['**/__tests__/**/*.test.tsx'],
  transformIgnorePatterns: ['node_modules/(?!ssr-window)'],
};
