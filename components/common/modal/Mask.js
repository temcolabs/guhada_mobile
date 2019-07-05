import React from 'react';
import ReactDom from 'react-dom';
import css from './Mask.module.scss';
import { isBrowser } from 'lib/isServer';
import { Transition } from 'react-transition-group';
import anime from 'animejs';

const DURATION = 400;

const animation = {
  onEnter: node => {
    anime({
      targets: node,
      opacity: 0.8,
      easing: 'linear',
      duration: DURATION,
      begin: function(anim) {
        console.log(`begin onenter anim`, anim);
        node.style.display = 'block';
      },
    });
  },
  onExit: node => {
    anime({
      targets: node,
      opacity: 0,
      easing: 'linear',
      duration: DURATION,
      complete: function(anim) {
        console.log(`begin onenter anim`, anim);
        node.style.display = 'none';
      },
    });
  },
};

/**
 * 팝업이 열릴 때 뒤에 표시할 반투명 마스크
 *
 */
export default function Mask({ zIndex, isVisible }) {
  if (isBrowser) {
    const bodyEl = document.documentElement.getElementsByTagName('body')[0];

    let style = {};
    if (zIndex) {
      style = Object.assign(style, { zIndex });
    }
    return ReactDom.createPortal(
      <Transition
        in={isVisible}
        onEnter={animation.onEnter}
        onExit={animation.onExit}
      >
        {state => {
          return <div className={css.wrap} style={style} />;
        }}
      </Transition>,
      bodyEl
    );
  } else {
    return null;
  }
}
