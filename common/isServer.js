export const isBrowser = typeof window === 'object';
export const isServer = typeof window === 'undefined';

export default isServer;
