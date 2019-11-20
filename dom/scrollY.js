import canUseDOM from './canUseDOM';

export default function scrollY() {
  return canUseDOM() ? window.scrollY : null;
}
