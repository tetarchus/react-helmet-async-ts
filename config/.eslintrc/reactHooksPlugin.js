module.exports = {
  plugins: ['react-hooks'],
  settings: {},
  rules: {
    // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks#advanced-configuration
    'react-hooks/exhaustive-deps': ['warn', { additionalHooks: '' }],
    // https://reactjs.org/docs/hooks-rules.html
    'react-hooks/rules-of-hooks': 'error',
  },
};
