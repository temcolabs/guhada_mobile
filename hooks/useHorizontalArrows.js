import { useState, useEffect, useRef } from 'react';

/**
 * returns left-right flag to check if an horizontal element is scrollable
 * @param {Array} deps dependancy list
 * @param {number} offset scrollability checking offset
 * @returns {[any, boolean, boolean]} [scrollRef, arrowLeft, arrowRight]
 * `scrollRef` to use as a ref object on scrollable element
 * `arrowLeft` to check if element is scrollable to the left
 * `arrowRight` to check if element is scrollable to the right
 */
export const useHorizontalArrows = (deps = [], offset = 10) => {
  const scrollRef = useRef();
  const [arrowLeft, setArrowLeft] = useState(false);
  const [arrowRight, setArrowRight] = useState(true);

  const handler = (e) => {
    if (e.target.scrollLeft > offset) {
      setArrowLeft(true);
    } else {
      setArrowLeft(false);
    }
    if (
      e.target.scrollLeft <
      e.target.scrollWidth - e.target.clientWidth - offset
    ) {
      setArrowRight(true);
    } else {
      setArrowRight(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const tab = scrollRef.current;
      if (tab.scrollLeft <= tab.scrollWidth - tab.clientWidth - offset) {
        setArrowRight(true);
      } else {
        setArrowRight(false);
      }
      tab.addEventListener('scroll', handler);
    }
  }, [scrollRef.current, ...deps]);

  return [scrollRef, arrowLeft, arrowRight];
};
