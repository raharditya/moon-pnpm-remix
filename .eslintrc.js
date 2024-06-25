/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './apps/*/tsconfig.json'],
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:@typescript-eslint/recommended-type-checked', // too noisy
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'no-console': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-useless-path-segments': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'import/no-unassigned-import': ['warn', { allow: ['@*/ui/*.css', 'styles/*.css'] }],
  },
  env: {
    browser: false,
    node: true,
  },
};
