import { useEffect, useRef } from 'react';

/**
 * Synthetically simulate componentDidMount & componentDidUpdate lifecycle with Hooks
 * @param {function} componentDidMountCallback triggers only once on mount
 * @param {function} componentDidUpdateCallback triggers on every update but not on mount
 * @param {Array} deps
 */
export const useMountAndUpdate = (
  componentDidMountCallback = () => {},
  componentDidUpdateCallback = () => {},
  deps
) => {
  const componentDidMountRef = useRef();
  useEffect(() => {
    if (!componentDidMountRef.current) {
      componentDidMountRef.current = true;
      componentDidMountCallback();
    } else {
      componentDidUpdateCallback();
    }
  }, deps);
};
