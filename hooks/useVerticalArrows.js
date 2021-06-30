import { useState, useEffect, useRef } from 'react';

/**
 * returns top-bottom flag to check if an vertical element is scrollable
 * @param {Array} deps dependancy list
 * @param {number} offset scrollability checking offset
 * @returns {[any, boolean, boolean]} [scrollRef, arrowTop, arrowBottom]
 * `scrollRef` to use as a ref object on scrollable element
 * `arrowTop` to check if element is scrollable to the top
 * `arrowBottom` to check if element is scrollable to the bottom
 */
export const useVerticalArrows = (deps = [], offset = 10) => {
  const scrollRef = useRef();
  const [arrowTop, setArrowTop] = useState(false);
  const [arrowBottom, setArrowBottom] = useState(false);

  const handler = (e) => {
    if (e.target.scrollTop > offset) {
      setArrowTop(true);
    } else {
      setArrowTop(false);
    }
    if (
      e.target.scrollTop <
      e.target.scrollHeight - e.target.clientHeight - offset
    ) {
      setArrowBottom(true);
    } else {
      setArrowBottom(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const tab = scrollRef.current;
      if (tab.scrollTop < tab.scrollHeight - tab.clientHeight - offset) {
        setArrowBottom(true);
      } else {
        setArrowBottom(false);
      }
      tab.addEventListener('scroll', handler);
    }
  }, [scrollRef.current, ...deps]);

  return [scrollRef, arrowTop, arrowBottom];
};
