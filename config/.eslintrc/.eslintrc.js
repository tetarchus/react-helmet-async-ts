// Base configs
const logic = require('./baseLogicRules');
const style = require('./baseStyleRules');
const formatting = require('./baseFormattingRules');
// Plugin configs
const a11y = require('./a11yPlugin');
const importPlugin = require('./importPlugin');
const jest = require('./jestPlugin');
const reactHooks = require('./reactHooksPlugin');
const react = require('./reactPlugin');
const testingLib = require('./testingLibraryPlugin');
const typescript = require('./typescriptPlugin');
const typescriptExt = require('./typescriptPluginExtended');
const unicorn = require('./unicornPlugin');

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowReserved: false,
    ecmaFeatures: { impliedStrict: true, jsx: true, modules: true },
    // babelOptions: { configFile: `${__dirname}/../babelrc/web.babel.js` },
    ecmaVersion: '6',
    sourceType: 'module',
    requireConfigFile: false,
    tsconfigRootDir: `${__dirname}/../../`,
    project: ['./tsconfig.json', './tsconfig.testing.json'],
  },
  globals: {
    __DEV__: 'readonly',
    ga: 'readonly',
    global: 'readonly',
    process: 'readonly',
  },
  env: {
    browser: true,
    es2015: true,
    node: false,
  },
  ignorePatterns: ['**/node_modules/**', '**/dist/', '**/lib/'],
  reportUnusedDisableDirectives: true,
  plugins: [
    ...a11y.plugins,
    ...importPlugin.plugins,
    ...react.plugins,
    ...reactHooks.plugins,
    ...testingLib.plugins,
    ...typescript.plugins,
    ...unicorn.plugins,
    ...jest.plugins,
  ],
  settings: {
    ...a11y.settings,
    ...importPlugin.settings,
    ...react.settings,
    ...reactHooks.settings,
    ...testingLib.settings,
    ...typescript.settings,
    ...unicorn.settings,
    ...jest.settings,
  },
  rules: {
    ...logic.rules,
    ...style.rules,
    ...formatting.rules,
    ...a11y.rules,
    ...importPlugin.rules,
    ...react.rules,
    ...reactHooks.rules,
    ...testingLib.rules,
    ...typescript.rules,
    ...typescriptExt.rules,
    ...unicorn.rules,
    ...jest.rules,
  },
  overrides: [
    ...typescript.overrides,
    ...typescriptExt.overrides,
    ...jest.overrides,
    {
      files: ['webpack/**/*.js', 'webpack.*.js'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-dynamic-require': 'off',
        'import/unambiguous': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
};
