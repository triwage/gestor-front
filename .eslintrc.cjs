module.exports = {
  extends: ['@rocketseat/eslint-config/react'],
  plugins: ['eslint-plugin-import-helpers', 'react-refresh'],
  rules: {
    'react-hooks/exhaustive-deps': 0,
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always', // new line between groups
        groups: [
          '/^react/',
          '/^next/',
          'module',
          '/components/',
          '/services/',
          '/store/',
          '/utils/',
          '/@types/',
          '/^/',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
      },
    ],
    camelcase: 'off',
    'react-refresh/only-export-components': 'warn',
  },
}
