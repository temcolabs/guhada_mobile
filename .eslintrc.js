module.exports = {
  extends: ['react-app'],
  parser: 'babel-eslint',
  plugins: ['react-hooks'],
  globals: {
    define: true,
    $: true,
    jQuery: true,
    daum: true,
    FB: true,

    naver: true,
    DaumConversionDctSv: true,
    DaumConversionAccountID: true,
    wptg_tagscript_vars: true,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off', // Link 컴포넌트(https://github.com/zeit/next.js#with-link)
    'react-hooks/exhaustive-deps': 'off',
    'jsx-a11y/alt-text': 'off', // image alt text

    // react hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
