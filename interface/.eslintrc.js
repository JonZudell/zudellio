module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier', // Keep this line to extend from eslint-config-prettier
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', 'prettier'],
  rules: {
    'no-undef': 'off', // Allow the use of undefined
    'jsx-a11y/tabindex-no-positive': 'off', // Ignore tabIndex rule
    'prettier/prettier': 'warn', // Add this line to warn on Prettier errors
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
