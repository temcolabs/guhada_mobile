(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  }
})(this, function(b) {
  const isBrowser = typeof window === 'object';
  const isServer = typeof window === 'undefined';

  return { isServer, isBrowser };
});
