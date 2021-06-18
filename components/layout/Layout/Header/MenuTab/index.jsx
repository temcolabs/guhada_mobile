import css from './MenuTab.module.scss';
import { useEffect, memo, useRef } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useHorizontalArrows } from 'hooks';
import Link from 'next/link';

const menuList = [
  ['홈', '/'],
  ['여성', '/home/women'],
  ['남성', '/home/men'],
  ['키즈', '/home/kids'],
  ['리뷰', '/review'],
  ['랭킹', '/ranking'],
  ['선물하기', '/gift'],
  ['타임딜', '/event/timedeal'],
  ['럭키드로우', '/event/luckydraw'],
  ['기획전', '/event/special'],
  ['이벤트', '/event'],
];

function MenuTab() {
  const selectedRef = useRef();
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows();
  const router = useRouter();

  /**
   * handlers
   */
  const handleClickSelected = () => {
    scrollRef.current.scrollTo({
      left:
        selectedRef.current.offsetLeft +
        selectedRef.current.clientWidth / 2 -
        scrollRef.current.clientWidth / 2 -
        10,
      behavior: 'smooth',
    });
  };
  const handleScrollLeft = () => {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft - 330,
      behavior: 'smooth',
    });
  };
  const handleScrollRight = () => {
    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollLeft + 330,
      behavior: 'smooth',
    });
  };

  /**
   * side effect
   */
  useEffect(() => {
    if (selectedRef.current) {
      scrollRef.current.scrollLeft =
        selectedRef.current.offsetLeft +
        selectedRef.current.clientWidth / 2 -
        scrollRef.current.clientWidth / 2 -
        10;
    }
  }, []);

  /**
   * render
   */
  return (
    <div className={css['menu-tab']} ref={scrollRef}>
      {menuList.map(([name, path]) =>
        router.pathname === path ? (
          <div
            key={name}
            className={cn(
              css['tab-item'],
              css['selected'],

              (name === '타임딜' || name === '럭키드로우') && css['event']
            )}
            ref={selectedRef}
            onClick={handleClickSelected}
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
          onClick={handleScrollLeft}
        />
      )}
      {arrowRight && (
        <span
          className={cn(css['tab-arrow'], css['arrow--right'])}
          onClick={handleScrollRight}
        />
      )}
    </div>
  );
}

export default memo(MenuTab);
