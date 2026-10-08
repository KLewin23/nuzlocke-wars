import eslint from '@eslint/js';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import functional from 'eslint-plugin-functional';
import nextTs from 'eslint-config-next/typescript';
import noBarrelFiles from 'eslint-plugin-no-barrel-files';
import nextVitals from 'eslint-config-next/core-web-vitals';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';

const config = [
	eslint.configs.recommended,
	// functional.configs.recommended,
	functional.configs.externalTypeScriptRecommended,
	...tseslint.configs.recommendedTypeChecked,
	functional.configs.noOtherParadigms,
	functional.configs.noMutations,
	...tseslint.configs.stylisticTypeChecked,
	functional.configs.stylistic,
	...noBarrelFiles.configs['flat/recommended'],
	...nextVitals,
	...nextTs,
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'cypress/mocks.js', 'eslint.config.mjs']),
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: {
			react,
			'@stylistic': stylistic,
			'prefer-arrow-functions': preferArrowFunctions,
		},
		settings: {
			react: { version: '19.2.8' },
		},
		rules: {
			'react/function-component-definition': [
				'error',
				{ namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
			],
			'func-style': ['error', 'expression', { allowArrowFunctions: true }],
			'@typescript-eslint/array-type': ['error', { default: 'generic', readonly: 'generic' }],
			'@typescript-eslint/consistent-type-definitions': 'error',
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{ prefer: 'type-imports', fixStyle: 'inline-type-imports' },
			],
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'arrow-body-style': ['error', 'as-needed'],
			'prefer-arrow-callback': 'error',
			curly: ['error', 'multi'],
			'prefer-arrow-functions/prefer-arrow-functions': 'error',
			'functional/readonly-type': ['error', 'generic'],
			'functional/functional-parameters': ['error', { enforceParameterCount: false }],
			'functional/no-return-void': 'off',
			'functional/prefer-immutable-types': 'off',
			'functional/no-expression-statements': 'off',
			'functional/type-declaration-immutability': 'off',
			'functional/no-mixed-types': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
			'no-console': 'error',
		},
	},
	{
		files: ['src/lib/components/*/.{ts,tsx}'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					paths: ['@atoms', '@molecules', '@organisms'].map(name => ({
						name,
						message:
							'Use a direct import inside the component library to avoid barrel cycles and client/server leaks.',
					})),
				},
			],
		},
	},
];

export default config;
