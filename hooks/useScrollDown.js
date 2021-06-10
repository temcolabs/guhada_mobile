import { useState, useEffect, useCallback } from 'react';
import { debounce as _debounce } from 'lodash';

/**
 * get debounced boolean value for current scroll direction
 * @returns {bool} `true` if scroll direction is down
 */
export const useScrollDown = () => {
  const [isScrollDown, setIsScrollDown] = useState(false);
  let prev = 0;
  const handler = useCallback(
    _debounce((e) => {
      let curr = window.pageYOffset || document.documentElement.scrollTop;
      if (curr > prev) {
        setIsScrollDown(true);
      } else {
        setIsScrollDown(false);
      }
      prev = curr <= 0 ? 0 : curr;
    }, 10),
    []
  );
  useEffect(() => {
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [handler]);
  return isScrollDown;
};
