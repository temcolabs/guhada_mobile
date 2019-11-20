import { isBrowser } from '../common/isServer';

export const HOSTNAME =
  isBrowser && /^(https?:\/\/[^/]+)\//.exec(window.location.href)[1];
