/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from 'jest';
import { createDefaultPreset, pathsToModuleNameMapper } from 'ts-jest';

import tsconfig from './tsconfig.json' with { type: 'json' };

const presetConfig = createDefaultPreset({});

const config: Config = {
	...presetConfig,
	clearMocks: true,
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>'],
	modulePaths: ["."],
	moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
};

export default config;
