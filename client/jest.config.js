module.exports = {
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!axios/.*)',
    ],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'jest-transform-stub',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};