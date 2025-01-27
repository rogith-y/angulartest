module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    transform: {
      '^.+\\.(ts|mjs|html|js|json)$': 'ts-jest',
    },
    coverageDirectory: './coverage',
    coverageReporters: ['json-summary', 'lcov', 'text'],
    collectCoverage: true,
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.spec.json',
      },
    },
  };