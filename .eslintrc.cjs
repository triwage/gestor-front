module.exports = {
  extends: ['@rocketseat/eslint-config/react'],
  plugins: ['eslint-plugin-import-helpers', 'react-refresh'],
  rules: {
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always', // new line between groups
        groups: [
          '/^react/',
          '/^next/',
          'module',
          '/^~/components/',
          '/^~/services/',
          '/^~/store/',
          '/^~/utils/',
          '/^~/',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true,
        },
      },
    ],
    'react-refresh/only-export-components': 'warn',
  },
}
