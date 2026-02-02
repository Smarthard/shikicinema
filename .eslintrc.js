module.exports = {
    'root': true,
    'overrides': [
        {
            'files': [
                '**/*.html',
            ],
            'parser': '@angular-eslint/template-parser',
            'extends': [
                'plugin:@angular-eslint/recommended',
                "plugin:@angular-eslint/template/accessibility"
            ],
            'rules': {
                'sort-imports-es6-autofix/sort-imports-es6': 'off',
            },
        },
        {
            'files': [
                '**/*.ts',
            ],
            'parser': '@typescript-eslint/parser',
            'parserOptions': {
                project: 'tsconfig.json',
                sourceType: 'module',
                createDefaultProgram: true,
            },
            'env': {
                node: true,
                jest: true,
            },
            'extends': [
                'google',
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@typescript-eslint/recommended',
                "plugin:@angular-eslint/recommended",
                "plugin:@angular-eslint/template/process-inline-templates",
            ],
            'plugins': [
                '@typescript-eslint/eslint-plugin',
                'sort-imports-es6-autofix',
            ],
            'rules': {
                '@angular-eslint/component-class-suffix': 'off',
                '@typescript-eslint/no-empty-function': ['error', { 'allow': ['constructors'] }],
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': ['warn', {
                    "args": "all",
                    "argsIgnorePattern": "^_",
                    "caughtErrors": "all",
                    "caughtErrorsIgnorePattern": "^_",
                    "destructuredArrayIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }],
                '@typescript-eslint/interface-name-prefix': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                'semi': 'off',
                'no-extra-parens': 'error',
                'require-atomic-updates': 'error',
                'block-scoped-var': 'error',
                'default-param-last': 'error',
                'default-case-last': 'error',
                'eqeqeq': 'error',
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
                    'overrides': {
                        '?': 'before',
                        ':': 'before',
                    },
                }],
                'space-in-parens': ['error', 'never'],
                'no-duplicate-imports': 'error',
                'no-useless-computed-key': 'error',
                'no-useless-rename': 'error',
                'indent': [
                    'error',
                    4,
                    {
                        'SwitchCase': 1,
                        'ignoredNodes': [
                            'FunctionExpression > .params[decorators.length > 0]',
                            'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
                            'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
                        ],
                    },
                ],
                'new-cap': 'off',
                'require-jsdoc': 'off',
                // see https://github.com/marudor/eslint-plugin-sort-imports-es6-autofix/blob/master/README.md
                'sort-imports-es6-autofix/sort-imports-es6': ['error', {
                    'memberSyntaxSortOrder': ['none', 'all', 'single', 'multiple'],
                }],
                'no-restricted-imports': [
                    'warn',
                    {
                        'patterns': [
                            {
                                'group': ['.*'],
                                'message': 'Don\'t use relative path imports!',
                            },
                        ],
                    }
                ],
                'spaced-comment': ['error', 'always', {
                    'line': {
                        'markers': ['#region', '#endregion', 'region', 'endregion'],
                    },
                },
                ],
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        'type': 'attribute',
                        'prefix': 'app',
                        'style': 'camelCase',
                    },
                ],
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        'type': 'element',
                        'prefix': 'app',
                        'style': 'kebab-case',
                    },
                ],
            },
        },
    ],
    'ignorePatterns': [
        'node_modules',
        'dist',
        '**/index.ts',
        'src/test.ts',
    ],
};
