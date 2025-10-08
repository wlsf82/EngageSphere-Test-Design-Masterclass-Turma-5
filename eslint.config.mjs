import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: ['cypress'],
    extends: [
      'eslint:recommended',
      'plugin:cypress/recommended',
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'error',
    },
  },
]);
