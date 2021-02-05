module.exports = {
    roots: ['<rootDir>/test'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main/**',
        '!<rootDir>/src/**/**/index.ts'
    ],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: {
        '.+\\.ts$': 'ts-jest'
    },
    moduleNameMapper: {
      '@/test/(.*)': '<rootDir>/test/$1',
      '@/(.*)': '<rootDir>/src/$1'
    }
}