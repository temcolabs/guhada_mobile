import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export const useScrollPosition = (ref) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [winScroll, setWinScroll] = useState(0);
  const [height, setheight] = useState(0);

  const handleScrollPosition = useCallback(
    debounce((e) => {
      if (!ref) ref = document;
      const winScroll = ref.body.scrollTop || ref.documentElement.scrollTop;

      const height =
        ref.documentElement.scrollHeight - ref.documentElement.clientHeight;

      setScrollPosition(winScroll / height);
      setWinScroll(winScroll);
      setheight(height);
    }, 10),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScrollPosition);
    return () => window.removeEventListener('scroll', handleScrollPosition);
  }, [handleScrollPosition]);

  return scrollPosition;
};
