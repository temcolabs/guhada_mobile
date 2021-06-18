import css from './MenuTab.module.scss';
import { useState, useEffect, memo, useRef, createRef } from 'react';
import cn from 'classnames';
import { useHorizontalArrows } from 'hooks';
import Link from 'next/link';

const menuList = [
  ['홈', '/'],
  ['여성', '/home/women'],
  ['남성', '/home/women'],
  ['키즈', '/home/kids'],
  ['리뷰', '/review'],
  ['랭킹', '/ranking'],
  ['선물하기', '/gift'],
  ['타임딜', '/event/timedeal'],
  ['럭키드로우', '/event/luckydraw'],
  ['기획전', '/event/special'],
  ['이벤트', '/event'],
];

const staticSelectedRef = createRef();

function MenuTab() {
  /**
   * states
   */
  const [selected, setSelected] = useState(
    window ? window.location.pathname : ''
  );
  const selectedRef = useRef();
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows();

  /**
   * handlers
   */
  const handleClick = (target, path) => {
    const left =
      target.offsetLeft +
      target.clientWidth / 2 -
      scrollRef.current.clientWidth / 2 -
      10;

    scrollRef.current.scrollTo({
      left,
      behavior: 'smooth',
    });

    if (path) {
      setSelected(path);
      if (!staticSelectedRef.current) {
        staticSelectedRef.current = { prevLeft: left };
      }
      staticSelectedRef.current.left = scrollRef.current.scrollLeft;
    }
  };

  /**
   * side effect
   */
  useEffect(() => {
    const scrollLeft =
      selectedRef.current.offsetLeft +
      selectedRef.current.clientWidth / 2 -
      scrollRef.current.clientWidth / 2 -
      10;

    if (staticSelectedRef.current) {
      if (staticSelectedRef.current.prevLeft) {
        scrollRef.current.scrollLeft = staticSelectedRef.current.prevLeft;
        staticSelectedRef.current.prevLeft = null;
      } else {
        scrollRef.current.scrollLeft = staticSelectedRef.current.left;
        scrollRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth',
        });
      }
    } else {
      scrollRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  /**
   * render
   */
  return (
    <div className={css['menu-tab']} id="menu-tab" ref={scrollRef}>
      {menuList.map(([name, path]) =>
        selected === path ? (
          <div
            key={name}
            className={cn(
              css['tab-item'],
              css['selected'],

              (name === '타임딜' || name === '럭키드로우') && css['event']
            )}
            ref={selectedRef}
            onClick={(e) => handleClick(e.target)}
          >
            {name}
          </div>
        ) : (
          <div
            key={name}
            className={cn(
              css['tab-item'],

              (name === '타임딜' || name === '럭키드로우') && css['event']
            )}
            onClick={(e) => handleClick(e.target, path)}
          >
            <Link href={path}>
              <a>{name}</a>
            </Link>
          </div>
        )
      )}
      {arrowLeft && (
        <span
          className={cn(css['tab-arrow'], css['arrow--left'])}
          onClick={() => (scrollRef.current.scrollLeft -= 330)}
        />
      )}
      {arrowRight && (
        <span
          className={cn(css['tab-arrow'], css['arrow--right'])}
          onClick={() => (scrollRef.current.scrollLeft += 330)}
        />
      )}
    </div>
  );
}

export default memo(MenuTab);
