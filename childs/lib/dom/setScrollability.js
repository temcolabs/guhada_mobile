import canUseDOM from './canUseDOM';

const checkIsMobile = () =>
  canUseDOM() && /mobile/i.test(window.navigator.userAgent);

/**
 * 스크롤 방지
 * @param {*} isLock
 * @param {*} isLockTouchmove 터치 이벤트를 막는다. 모달에 스크롤되는 컨텐츠가 있을 경우 스크롤이 불가능해짐.
 * @param {*} scrollPosition
 */
export default function setScrollability({
  isLockScroll = false,
  isLockTouchmove = false,
  scrollPosition = 0,
}) {
  const isMobile = checkIsMobile();

  if (canUseDOM()) {
    let root = document.documentElement;

    if (isLockScroll) {
      // Disable scrolling.
      if (isMobile && isLockTouchmove) {
        document.ontouchmove = (e) => {
          e.preventDefault();
        };
      } else {
        // TODO : IOS 처리
        root.style.overflow = 'hidden';
      }
    } else if (!isLockScroll) {
      // Enable scrolling.
      if (isMobile && isLockTouchmove) {
        document.ontouchmove = () => true;
      } else {
        root.style.removeProperty('overflow');
        window.scrollTo(0, scrollPosition);
      }
    }
  }
}

/**
 * 스크롤 가능
 *
 * @export
 */
export function enableScroll() {
  if (window.removeEventListener)
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.onmousewheel = document.onmousewheel = null;
  window.onwheel = null;
  window.ontouchmove = null;
  document.onkeydown = null;
}

/**
 * 스크롤 방지
 *
 * @export
 */
export function disableScroll() {
  if (window.addEventListener)
    // older FF
    window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove = preventDefault; // mobile
  document.onkeydown = preventDefaultForScrollKeys;
}

export const isScrollable = () => {
  if (canUseDOM()) {
    const browserHeight = window.innerHeight; // 뷰포트 높이
    const documentHeight = document.documentElement.offsetHeight;
    const isScrollable = documentHeight > browserHeight;

    return isScrollable;
  } else {
    return false;
  }
};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault) e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  var keyMakeScroll = { 37: 1, 38: 1, 39: 1, 40: 1 };

  if (keyMakeScroll[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}
