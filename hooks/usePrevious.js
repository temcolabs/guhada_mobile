import { useEffect, useRef } from 'react';

/**
 * set and get previous props or state value within a component
 * @param {any} value
 * @returns {any} previous value of props or state
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
