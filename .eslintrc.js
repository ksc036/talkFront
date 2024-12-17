module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    // 'airbnb',
    // 'airbnb-typescript',
    // 'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint', 'import'],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-extraneous-dependencies': 0,
    'react/require-default-props': 0,
    'lines-between-class-members': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index','type'],
        'pathGroups': [
          {
            'pattern': '{react*, react*/**}',
            'group': 'builtin',
            'position': 'before'
          },
          {
            'pattern': '@desktop/**',
            'group': 'internal'
          },
          {
            'pattern': '@mobile/**',
            'group': 'internal'
          },
          {
            'pattern': 'src/**',
            'group': 'internal'
          },
        ],
        'pathGroupsExcludedImportTypes': ['src/**'],
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        },
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['build/**', 'dist/**', 'node_modules/', '.eslintrc.js'],
};
