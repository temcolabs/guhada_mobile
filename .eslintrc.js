module.exports = {
  extends: ['react-app'],
  parser: 'babel-eslint',
  plugins: [],
  globals: {
    define: true,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 0, // Link 컴포넌트(https://github.com/zeit/next.js#with-link)
    'react-hooks/exhaustive-deps': 0,
  },
};
