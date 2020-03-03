import { useCallback, useRef, useState } from 'react';

export default () => {
  const [isOnScroll, setIsOnScroll] = useState(false);

  const scrollTimeout = useRef(false);

  const handleScrollMyBBS = useCallback(e => {
    clearTimeout(scrollTimeout.current);
    setIsOnScroll(true);
    scrollTimeout.current = setTimeout(() => {
      setIsOnScroll(false);
    }, 300);
  }, []);

  return [isOnScroll, handleScrollMyBBS];
};
