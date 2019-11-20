import { isBrowser } from 'childs/lib/common/isServer';

export const HOSTNAME =
  isBrowser && /^(https?:\/\/[^\/]+)\//.exec(window.location.href)[1];
