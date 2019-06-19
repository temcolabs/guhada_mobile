const isBrowser = typeof window === 'object';
const isServer = typeof window === 'undefined';

module.exports = { isServer, isBrowser };
