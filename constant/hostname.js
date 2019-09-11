import { isBrowser } from '../lib/isServer';

export const HOSTNAME =
  isBrowser && /^(https?:\/\/[^\/]+)\//.exec(window.location.href)[1];
