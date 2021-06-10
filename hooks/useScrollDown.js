import { useState, useEffect, useCallback } from 'react';
import { debounce as _debounce } from 'lodash';

/**
 * get debounced boolean value for current scroll direction
 * @param {number} offset offset value for scrollY
 * @returns {bool} `true` if scroll direction is down
 */
export const useScrollDown = (offset = 0) => {
  const [isScrollDown, setIsScrollDown] = useState(false);
  let prev = offset;
  const handler = useCallback(
    _debounce((e) => {
      let curr = window.pageYOffset || document.documentElement.scrollTop;
      if (curr > prev) {
        setIsScrollDown(true);
      } else {
        setIsScrollDown(false);
      }
      prev = curr <= offset ? offset : curr;
    }, 10),
    []
  );
  useEffect(() => {
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [handler]);
  return isScrollDown;
};
