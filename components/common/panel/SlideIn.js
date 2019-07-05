import React from 'react';
import ReactDom from 'react-dom';
import css from './SlideIn.module.scss';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { isBrowser } from 'lib/isServer';
import Mask from '../modal/Mask';

/**
 * 진입 방향
 */
export const slideDirection = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
};

const DURATION = 400; // 애니메이션 시간

/**
 * 기본 포지션. 진입 방향에 따라 달라진다.
 */
const defaultPosition = {
  [slideDirection.LEFT]: {
    top: 0,
    left: '-100vw',
  },
  [slideDirection.RIGHT]: {
    top: 0,
    left: '100vw',
  },
  [slideDirection.TOP]: {
    bottom: '100vh',
    left: 0,
  },
  [slideDirection.BOTTOM]: {
    top: '100vh',
    left: 0,
  },
};

const slideAnimation = {
  // 왼쪽
  [slideDirection.LEFT]: {
    onEnter: node => {
      anime({
        targets: node,
        left: 0,
        duration: DURATION,
        easing: 'easeInOutQuad',
        begin: function(anim) {
          node.style.display = 'block'; // 애니메이션 시작할 none에서 block으로
        },
      });
    },
    onExit: node => {
      anime({
        targets: node,
        left: '-100vw',
        duration: DURATION,
        easing: 'easeInOutQuad',
        complete: function(anim) {
          node.style.display = 'none';
        },
      });
    },
  },
  // 오른쪽
  [slideDirection.RIGHT]: {
    onEnter: node => {
      anime({
        targets: node,
        left: 0,
        duration: DURATION,
        easing: 'easeInOutQuad',
        begin: function(anim) {
          node.style.display = 'block'; // 애니메이션 시작할 none에서 block으로
        },
      });
    },
    onExit: node => {
      anime({
        targets: node,
        left: '100vw',
        duration: DURATION,
        easing: 'easeInOutQuad',
        complete: function(anim) {
          node.style.display = 'none';
        },
      });
    },
  },
  [slideDirection.TOP]: {
    onEnter: node => {
      anime({
        targets: node,
        bottom: '0',
        duration: DURATION,
        easing: 'easeInOutQuad',
        begin: function(anim) {
          node.style.display = 'block'; // 애니메이션 시작할 none에서 block으로
        },
      });
    },
    onExit: node => {
      anime({
        targets: node,
        bottom: '100vh',
        duration: DURATION,
        easing: 'easeInOutQuad',
        complete: function(anim) {
          node.style.display = 'none';
        },
      });
    },
  },
  [slideDirection.BOTTOM]: {
    onEnter: node => {
      anime({
        targets: node,
        top: '0',
        duration: DURATION,
        easing: 'easeInOutQuad',
        begin: function(anim) {
          node.style.display = 'block'; // 애니메이션 시작할 none에서 block으로
        },
      });
    },
    onExit: node => {
      anime({
        targets: node,
        top: '100vh',
        duration: DURATION,
        easing: 'easeInOutQuad',
        complete: function(anim) {
          node.style.display = 'none';
        },
      });
    },
  },
};

export default function SlideIn({
  isVisible = false,
  direction,
  children,
  zIndex, // css.wrap 클래스에 선언된 SlideIn의 기본 z-index는 1000.
  wrapperStyle = {}, // css.wrap 클래스의 스타일을 덮어씌움
}) {
  if (isBrowser) {
    const bodyEl = document.documentElement.getElementsByTagName('body')[0];

    const positionStyle = defaultPosition[direction];
    const animation = slideAnimation[direction];

    let style = Object.assign({}, positionStyle, wrapperStyle);
    if (zIndex) {
      Object.assign(style, { zIndex });
    }

    return ReactDom.createPortal(
      <>
        <Transition
          in={isVisible}
          onEnter={animation.onEnter}
          onExit={animation.onExit}
          timeout={DURATION}
        >
          {state => {
            return (
              <div className={css.wrap} style={style}>
                {children}
              </div>
            );
          }}
        </Transition>
        <Mask isVisible={isVisible} />
      </>,
      bodyEl
    );
  } else {
    return null;
  }
}
