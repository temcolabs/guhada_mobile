module.exports = {
  extends: ['react-app'],
  parser: 'babel-eslint',
  plugins: ['react-hooks'],
  globals: {
    define: true,
    $: true,
    jQuery: true,
    daum: true,
    DaumConversionDctSv: true,
    DaumConversionAccountID: true,
    wptg_tagscript: true,
    wcs_add: true,
    wcs_do: true,
    wcs: true,
    _nasa: true,
    kochava: true,
    kakaoPixel: true,
    gtag: true,
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off', // Link 컴포넌트(https://github.com/zeit/next.js#with-link)
    'react-hooks/exhaustive-deps': 'off',
    'jsx-a11y/alt-text': 'off', // image alt text

    // react hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // jsx
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
};
