import { useState, useEffect } from 'react';

/**
 * @param {number} offset
 * @returns {boolean} flag to check if scrollY is greater than the offset value
 */
export const useScrolled = (offset = 60) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handler = () => {
    if (window.scrollY > offset) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return isScrolled;
};
