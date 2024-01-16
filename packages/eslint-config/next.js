module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'standard',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: [
      '@typescript-eslint'
    ],
    rules: {
      'prettier/prettier': ["error", {
        'printWidth': 80,
        'tabWidth': 2,
        'singleQuote': true,
        'trailingComma': 'all',
        'arrowParens': 'always',
        'semi': false,
        'endOfLine': 'auto',
      }],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        [require.resolve('@typescript-eslint/parser')]: ['.ts', '.tsx', '.d.ts'],
      },
    }
  }