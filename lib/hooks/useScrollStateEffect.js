import { useEffect, createRef } from 'react';

const scrollStateRef = createRef();

/**
 * memoize the current scroll-y offset as a state on unmount
 * and imperatively directs scroll-y to the memoized offset state on mount
 * @param {number} offset scrolled offset
 */
export const useScrollStateEffect = (offset = 0) => {
  useEffect(() => {
    if (scrollStateRef.current) {
      window.scrollTo(0, scrollStateRef.current + offset);
      return () => {
        scrollStateRef.current = null;
      };
    } else {
      return () => {
        scrollStateRef.current = window.scrollY;
      };
    }
  }, []);
};
