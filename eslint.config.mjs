import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import security from 'eslint-plugin-security'
import sonarjs from 'eslint-plugin-sonarjs'
import jest from 'eslint-plugin-jest'
import promise from 'eslint-plugin-promise'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'

export default [

  js.configs.recommended,

  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
      },
    },
  },

  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      security,
      sonarjs,
      jest,
      promise,
      unicorn,
    },

    rules: {

      // -------------------------
      // TYPESCRIPT
      // -------------------------

      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // Nest часто использует DTO classes
      '@typescript-eslint/no-extraneous-class': 'off',

      // -------------------------
      // IMPORTS
      // -------------------------

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
        },
      ],

      'import/no-cycle': 'error',
      'import/no-default-export': 'error',

      // -------------------------
      // UNUSED
      // -------------------------

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      // -------------------------
      // PROMISES / ASYNC
      // -------------------------

      'promise/always-return': 'error',
      'promise/no-return-wrap': 'error',
      'promise/param-names': 'error',

      // -------------------------
      // SECURITY
      // -------------------------

      'security/detect-object-injection': 'off', // слишком шумный для Nest DTO

      // -------------------------
      // SONAR QUALITY
      // -------------------------

      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-duplicate-string': 'warn',

      // -------------------------
      // UNICORN (quality)
      // -------------------------

      'unicorn/prefer-node-protocol': 'error',
      'unicorn/throw-new-error': 'error',
      'unicorn/no-null': 'off',

      // -------------------------
      // GENERAL
      // -------------------------

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'eqeqeq': 'error',
      'curly': 'error',
    },
  },

  // -------------------------
  // TEST FILES
  // -------------------------

  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    plugins: { jest },
    languageOptions: {
      globals: jest.environments.globals.globals,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
]