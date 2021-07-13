import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

export const useScrollPosition = (ref) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleScrollPosition = useCallback(
    debounce((e) => {
      if (!ref) ref = document;
      const scrollTop = ref.body.scrollTop || ref.documentElement.scrollTop;

      const height =
        ref.documentElement.scrollHeight - ref.documentElement.clientHeight;

      setScrollPosition(scrollTop / height);
      setScrollTop(scrollTop);
    }, 10),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScrollPosition);
    return () => window.removeEventListener('scroll', handleScrollPosition);
  }, [handleScrollPosition]);

  return {
    scrollPosition,
    scrollTop,
  };
};
