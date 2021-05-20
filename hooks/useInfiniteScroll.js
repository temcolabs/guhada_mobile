import { useCallback, useRef } from 'react';

/**
 * @param {function} action action to dispatch when intersected on the element
 * @param {boolean} moreToLoad flag to describe whether action is allowed or not
 * @returns {function} an infinite scroll handler to use in place of react `ref`
 * @example
 * const handleInfiniteScroll = useInfinteScroll(action, moreToLoad);
 * <div ref={handleInfiniteScroll} />
 */
export const useInfinteScroll = (action, moreToLoad) => {
  const observer = useRef();

  const handleInfiniteScroll = useCallback(
    (node) => {
      if (!moreToLoad) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && moreToLoad) {
          action();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [action, moreToLoad]
  );

  return handleInfiniteScroll;
};
