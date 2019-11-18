import React, { useEffect, useState, useRef, useCallback } from 'react';
import cn from 'classnames';
import css from './LuckyDrawMainSlider.module.scss';
import anime from 'animejs';
import { Transition } from 'react-transition-group';
import { arrayOf, shape, string, number } from 'prop-types';
import moment from 'moment';

LuckyDrawMainSlider.prototype = {
  imageList: arrayOf(
    shape({
      titleImageUrl: string,
      requestFromAt: number,
      title: string,
    })
  ),
};

const EASING = 'easeInOutQuad';
const DELAY_ENTER = 500;
const DURATION = 400;

export default function LuckyDrawMainSlider({ imageList = [] }) {
  const [currentIndex, setIndex] = useState(0);
  const [isInTransition, setIsInTransition] = useState(false);

  const [touchStartX, setTouchStartX] = useState(0);

  const showNextSlide = useCallback(() => {
    const next = (currentIndex + 1) % imageList.length;

    if (next !== currentIndex && !isInTransition) {
      setIndex(next);
    }
  }, [currentIndex, imageList.length, isInTransition]);

  const showPrevSlide = useCallback(
    index => {
      const next =
        currentIndex - 1 < 0 ? imageList.length - 1 : currentIndex - 1;

      if (next !== currentIndex && !isInTransition) {
        setIndex(next);
      }
    },
    [currentIndex, imageList.length, isInTransition]
  );

  const handleClickSlideIndex = useCallback(
    index => {
      showNextSlide(index);
    },
    [showNextSlide]
  );

  useEffect(() => {
    setIndex(0);
    return () => {
      setIndex(0);
    };
  }, [imageList]);

  return (
    <div className={css.wrap}>
      <div className={css.contentsCircle}>
        {imageList.map((imageData = {}, index) => {
          return (
            <div key={index}>
              <Transition
                timeout={DURATION}
                mountOnEnter
                in={index === currentIndex}
                onEnter={node => {
                  anime({
                    delay: DELAY_ENTER,
                    targets: node,
                    easing: EASING,
                    opacity: 1,
                    duration: DURATION,
                    left: '40px',
                    begin: anim => {
                      node.style.left = '240px';
                      setIsInTransition(true);
                    },
                  });
                }}
                onExit={node => {
                  anime({
                    targets: node,
                    easing: EASING,
                    duration: DURATION,
                    opacity: 0,
                    left: '150px',
                    complete: anim => {
                      // 딜레이 후에 전환이 가능하도록 설정
                      setTimeout(() => {
                        setIsInTransition(false);
                      }, DELAY_ENTER);
                    },
                  });
                }}
              >
                {state => {
                  return (
                    <div
                      className={cn(css.productImage, css.transitionEl, {
                        [css[state]]: true,
                      })}
                      style={{
                        backgroundImage: `url(${imageData.titleImageUrl})`,
                      }}
                      onTouchStart={e => {
                        setTouchStartX(e.touches[0]?.pageX);
                      }}
                      onTouchEnd={e => {
                        const currentX = e.changedTouches[0]?.pageX;
                        const isRight = currentX < touchStartX;
                        const isLeft = currentX >= touchStartX;

                        if (isRight) {
                          showNextSlide();
                        } else if (isLeft) {
                          showPrevSlide();
                        }
                      }}
                    />
                  );
                }}
              </Transition>

              <Transition
                timeout={DURATION}
                mountOnEnter
                in={index === currentIndex}
                onEnter={node => {
                  anime({
                    delay: DELAY_ENTER - 20,
                    targets: node,
                    easing: EASING,
                    opacity: 1,
                    duration: DURATION,
                    left: '50%',
                    begin: function(anim) {
                      node.style.left = '70%';
                    },
                  });
                }}
                onExit={node => {
                  anime({
                    targets: node,
                    easing: EASING,
                    duration: DURATION,
                    opacity: 0,
                    left: '70%',
                    complete: function(anim) {},
                  });
                }}
              >
                {state => {
                  return (
                    <div
                      className={cn(css.startDate, css.transitionEl, {
                        [css[state]]: true,
                      })}
                    >
                      <span className={css.dateText}>
                        {moment(imageData.requestFromAt).format('M월 D일')}
                      </span>
                      <span className={css.openMarker}>OPEN</span>
                    </div>
                  );
                }}
              </Transition>

              <Transition
                timeout={DURATION}
                mountOnEnter
                in={index === currentIndex}
                onEnter={node => {
                  anime({
                    delay: DELAY_ENTER - 40,
                    targets: node,
                    easing: EASING,
                    opacity: 1,
                    duration: DURATION,
                    left: '50%',
                    begin: function(anim) {
                      node.style.opacity = 0;
                      node.style.left = '70%';
                    },
                  });
                }}
                onExit={node => {
                  anime({
                    targets: node,
                    easing: EASING,
                    duration: DURATION,
                    opacity: 0,
                    left: '70%',
                    complete: function(anim) {},
                  });
                }}
              >
                {state => {
                  return (
                    <div
                      className={cn(css.title, css.transitionEl, {
                        [css[state]]: true,
                      })}
                    >
                      {imageData.title}
                    </div>
                  );
                }}
              </Transition>
            </div>
          );
        })}
        <div className={css.indexDotWrap}>
          {imageList.map((_, index) => {
            return (
              <div
                className={cn({ [css.isCurrent]: index === currentIndex })}
                key={index}
                onClick={() => handleClickSlideIndex(index)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
