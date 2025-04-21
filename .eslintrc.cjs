module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: [
    'dist',
    '.eslintrc.cjs',
    'stories',
    'storybook-static',
    '**.test.tsx',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'eslint-plugin-react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@mui/material/Button',
            importNames: ['Button', 'default'],
            message: 'Please use Button from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Button'],
            message: 'Please use Button from /components instead',
          },
          {
            name: '@mui/material/Stack',
            importNames: ['Stack', 'default'],
            message: 'Please use Stack from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Stack'],
            message: 'Please use Stack from /components instead',
          },
          {
            name: '@mui/material/Grid',
            importNames: ['Grid', 'default'],
            message: 'Please use Grid from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Grid'],
            message: 'Please use Grid from /components instead',
          },
          {
            name: '@mui/material/Container',
            importNames: ['Container', 'default'],
            message: 'Please use Container from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Container'],
            message: 'Please use Container from /components instead',
          },
          {
            name: '@mui/material/Avatar',
            importNames: ['Avatar', 'default'],
            message: 'Please use Avatar from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Avatar'],
            message: 'Please use Avatar from /components instead',
          },
          {
            name: '@mui/material/Backdrop',
            importNames: ['Backdrop', 'default'],
            message: 'Please use Backdrop from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Backdrop'],
            message: 'Please use Backdrop from /components instead',
          },
          {
            name: '@mui/material/Modal',
            importNames: ['Modal', 'default'],
            message: 'Please use Modal from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Modal'],
            message: 'Please use Modal from /components instead',
          },
          {
            name: '@mui/material/Dialog',
            importNames: ['Dialog', 'default'],
            message: 'Please use Modal from /components instead',
          },
          {
            name: '@mui/material',
            importNames: ['Dialog'],
            message: 'Please use Modal from /components instead',
          },
        ],
      },
    ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'no-prototype-builtins': 'off',
    'react-refresh/only-export-components': 'off',
  },
}
