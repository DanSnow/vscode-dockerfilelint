module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['standard', 'plugin:@typescript-eslint/recommended', 'prettier', 'prettier/prettier'],
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier', 'simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
