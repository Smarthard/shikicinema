import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import globals from 'globals';

export default defineConfig(
  {
    ignores: [
      'node_modules',
      'dist',
      '**/index.ts',
      'src/test.ts',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        createDefaultProgram: true,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@angular-eslint/component-class-suffix': 'off',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      semi: 'off',
      'no-extra-parens': 'error',
      'require-atomic-updates': 'error',
      'block-scoped-var': 'error',
      'default-param-last': 'error',
      'default-case-last': 'error',
      eqeqeq: 'error',
      'no-lone-blocks': 'error',
      'no-return-await': 'error',
      'no-use-before-define': 'error',
      'block-spacing': 'error',
      'function-call-argument-newline': ['error', 'consistent'],
      'max-len': ['error', {
        code: 120,
        tabWidth: 4,
        ignoreUrls: true,
      }],
      'no-inline-comments': 'error',
      'no-whitespace-before-property': 'error',
      'object-curly-spacing': ['error', 'always'],
      'operator-linebreak': ['error', 'after', {
        overrides: {
          '?': 'before',
          ':': 'before',
        },
      }],
      'space-in-parens': ['error', 'never'],
      'no-duplicate-imports': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      indent: [
        'error',
        4,
        {
          SwitchCase: 1,
          ignoredNodes: [
            'FunctionExpression > .params[decorators.length > 0]',
            'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
            'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
          ],
        },
      ],
      'new-cap': 'off',
      'require-jsdoc': 'off',
      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['.*'],
              message: "Don't use relative path imports!",
            },
          ],
        },
      ],
      'spaced-comment': ['error', 'always', {
        line: {
          markers: ['#region', '#endregion', 'region', 'endregion'],
        },
      }],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
  },
);