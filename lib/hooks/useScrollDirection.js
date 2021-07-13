import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

/**
 * use debounced expression of the current window's scroll direction
 * @returns {'up'|'down'} current scroll direction
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  let lastScrollTop = 0;
  const handleScrollDirection = useCallback(
    _.debounce((e) => {
      let st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollTop = st <= 0 ? 0 : st;
    }, 10),
    []
  );
  useEffect(() => {
    window.addEventListener('scroll', handleScrollDirection);
    return () => window.removeEventListener('scroll', handleScrollDirection);
  }, [handleScrollDirection]);
  return scrollDirection;
};
