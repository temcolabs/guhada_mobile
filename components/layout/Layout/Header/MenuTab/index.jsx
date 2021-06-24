import css from './MenuTab.module.scss';
import { useEffect, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useHorizontalArrows } from 'hooks';
import { pushRoute } from 'childs/lib/router';

const defaultMenuList = [
  ['홈', '/'],
  ['여성', '/home/women'],
  ['남성', '/home/men'],
  ['키즈', '/home/kids'],
  ['리뷰', '/review'],
  ['랭킹', '/ranking'],
  ['럭키드로우', '/event/luckydraw'],
  ['타임딜', '/event/timedeal'],
  ['기획전', '/event/special'],
  ['이벤트', '/event'],
  ['선물하기', '/gift'],
];

function MenuTab({ menuList = defaultMenuList }) {
  /**
   * states
   */
  const selectedRef = useRef();
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows();
  const router = useRouter();

  /**
   * handlers
   */
  const handleClick = (path) => {
    pushRoute(path);
  };
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
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (selectedRef.current) {
      scrollRef.current.scrollLeft =
        selectedRef.current.offsetLeft +
        selectedRef.current.clientWidth / 2 -
        scrollRef.current.clientWidth / 2 -
        10;
    }
  }, [selectedRef.current]);

  /**
   * render
   */
  return (
    <ul className={css['menu-tab']} ref={scrollRef}>
      {menuList.map(([name, path]) =>
        router.asPath === path ? (
          <li
            key={name}
            className={cn(css['tab-item'], css['selected'])}
            ref={selectedRef}
            onClick={handleClickSelected}
          >
            {name}
          </li>
        ) : (
          <li
            key={name}
            className={cn(
              css['tab-item'],
              (name === '타임딜' || name === '럭키드로우') && css['event']
            )}
            onClick={() => handleClick(path)}
          >
            {name}
          </li>
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
    </ul>
  );
}

MenuTab.propTypes = {
  menuList: PropTypes.array,
};

export default memo(MenuTab);
