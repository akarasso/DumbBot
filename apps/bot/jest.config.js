module.exports = {
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*spec.js', '**/?(*.)+(spec|test).js'],
	moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
	collectCoverageFrom: [
		'build/**/*.js',
		'!**/node_modules',
		'!**/__tests__/**',
		'!**/__mocks__/**',
		'!**/?(*.)+(module).js',
		'!build/guards/*',
		'!build/services/abstract/*',
		'!build/index.js',
		'!build/app.module.js',
		'!build/services/container-service.js',
	],
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50,
		},
	},
}
