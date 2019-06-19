import isServer from 'lib/isServer';

export default function scrollY() {
  return isServer ? null : window.scrollY;
}
