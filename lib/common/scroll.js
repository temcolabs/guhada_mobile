import offsetToDocument from '../dom/offsetToDocument';

const canUseDOM = () => typeof window !== 'undefined';

const checkIsMobile = () =>
  canUseDOM() && /mobile/i.test(window.navigator.userAgent);

/**
 * 스크롤 방지
 * @param {*} isLock
 * @param {*} isLockTouchmove 터치 이벤트를 막는다. 모달에 스크롤되는 컨텐츠가 있을 경우 스크롤이 불가능해짐.
 */
export const setScrollability = ({
  isLockScroll = false,
  isLockTouchmove = false,
}) => {
  const isMobile = checkIsMobile();

  if (canUseDOM()) {
    let root = document.documentElement;
    const scrollPosition = window.pageYOffset;

    if (isLockScroll) {
      // Disable scrolling.
      if (isMobile && isLockTouchmove) {
        document.ontouchmove = (e) => {
          e.preventDefault();
        };
      } else {
        root.style.overflow = 'hidden';
        root.style.position = 'fixed';
        root.style.top = `-${scrollPosition}px`;
        root.style.width = '100%';
      }
    } else if (!isLockScroll) {
      // Enable scrolling.
      if (isMobile && isLockTouchmove) {
        document.ontouchmove = () => true;
      } else {
        root.style.removeProperty('overflow');
        root.style.removeProperty('position');
        root.style.removeProperty('top');
        root.style.removeProperty('width');
        window.scrollTo(0, scrollPosition);
      }
    }
  }
};

export const jumpToAnchor = (name = '') => {
  window.location.href = `#${name}`;
};

/**
 * smooth scrolling을 위해서는 polyfill 추가가 필요하다.
 * @param {*} name
 */
export const scrollToTarget = (
  option = {
    id: 'target',
    behavior: 'auto',
    onScrollEnd: () => {},
  }
) => {
  let { id, behavior, onScrollEnd } = option;

  // 아이디만 전달하는 케이스
  if (typeof option === 'string') {
    id = option;
  }

  const target = document.getElementById(id);

  if (target) {
    const scrollTo = offsetToDocument(target).top;

    disableScroll();

    window.scroll({
      top: scrollTo,
      left: 0,
      behavior,
    });

    var disposer = setInterval(() => {
      if (target.getBoundingClientRect().y < window.innerHeight / 2) {
        clearInterval(disposer);
        enableScroll();

        if (typeof onScrollEnd === 'function') {
          onScrollEnd();
        }
      }
    }, 200);
  } else {
    console.error('scrollToTarget: target element is null.');
  }
};

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keyMakeScroll = { 37: 1, 38: 1, 39: 1, 40: 1 };

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
  if (keyMakeScroll[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}
