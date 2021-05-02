module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{tsx,ts,js,jsx}'],
  coverageReporters: ['json-summary', 'text'],
  moduleFileExtensions: ['js', 'jsx','ts','tsx'],
  moduleDirectories: ['node_modules', 'src/'],
};
