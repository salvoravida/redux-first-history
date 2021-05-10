import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
   preset: 'ts-jest',
   testEnvironment: 'jsdom',
   globals: {
      'ts-jest': {
         tsconfig: 'tsconfig.json',
      },
   },
   collectCoverage: true,
   collectCoverageFrom: ['src/**/*.{tsx,ts,js,jsx}'],
   coverageReporters: ['json-summary', 'text'],
   moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
   moduleDirectories: ['node_modules', 'src/'],
   verbose: true,
   testPathIgnorePatterns: ['store.ts'],
};

export default config;
