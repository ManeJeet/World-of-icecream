export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        AudioWorkletGlobalScope: 'readonly' // No whitespace here
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn'
    }
  }
];
