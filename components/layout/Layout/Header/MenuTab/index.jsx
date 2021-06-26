import css from './MenuTab.module.scss';
import { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { useHorizontalArrows } from 'hooks';
import { pushRoute } from 'childs/lib/router';

const menuList = [
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

function MenuTab() {
  /**
   * states
   */
  const [scrollRef, arrowLeft, arrowRight] = useHorizontalArrows();
  const router = useRouter();
  const [selected, setSelected] = useState(router.asPath);

  /**
   * handlers
   */
  const handleClick = (path, target) => {
    if (selected !== path) {
      pushRoute(path);
      setSelected(path);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    handleClickSelected(target);
  };
  const handleClickSelected = (target, smooth = true) => {
    const menu = scrollRef.current;
    menu.scrollTo({
      left:
        target.offsetLeft + target.clientWidth / 2 - menu.clientWidth / 2 - 10,
      ...(smooth && { behavior: 'smooth' }),
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
    const target = document.getElementById(router.asPath);
    if (target) {
      setSelected(router.asPath);
      handleClickSelected(target, false);
    }
  }, [router]);

  /**
   * render
   */
  return (
    <ul className={css['menu-tab']} ref={scrollRef}>
      {menuList.map(([name, path]) => (
        <li
          id={path}
          key={name}
          className={cn(
            css['tab-item'],
            selected === path
              ? css['selected']
              : (name === '타임딜' || name === '럭키드로우') && css['event']
          )}
          onClick={(e) => handleClick(path, e.target)}
        >
          {name}
        </li>
      ))}
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
