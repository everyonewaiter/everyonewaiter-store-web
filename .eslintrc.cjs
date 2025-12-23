/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname, // ✅ 절대경로
  },

  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],

  rules: {
    // React
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',

    // TS
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',

    // import
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/order': 'warn',
    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',

    // a11y (실무 타협)
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-has-content': 'off',

        "arrow-body-style": "off"
  },

  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.eslint.json',
      },
    },
  },

  ignorePatterns: [
    'dist',
    'node_modules',
    'scripts',
    '*.cjs',
  ],
};
