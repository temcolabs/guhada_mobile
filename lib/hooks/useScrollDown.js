import { useState, useEffect } from 'react';
import { throttle as _throttle } from 'lodash';

/**
 * get debounced boolean value for current scroll direction
 * @param {number} offset offset value for scrollY
 * @returns {bool} `true` if scroll direction is down
 */
export const useScrollDown = (offset = 80) => {
  const [isScrollDown, setIsScrollDown] = useState(false);

  let prev = offset;
  const handler = _throttle(() => {
    let curr = window.pageYOffset || document.documentElement.scrollTop;
    if (curr >= prev + 10) {
      setIsScrollDown(true);
    } else if (curr < prev - 10) {
      setIsScrollDown(false);
    }
    prev = curr <= offset ? offset : curr;
  }, 50);

  useEffect(() => {
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return isScrollDown;
};

/**
 * get debounced boolean value for current scroll direction
 * @param {number} offset offset value for scrollY
 * @returns {bool} `true` if scroll direction is down
 */
export const useScrollDownElement = (offset = 80, element) => {
  const [isScrollDown, setIsScrollDown] = useState(false);

  let prev = offset;
  const handler = _throttle(() => {
    let curr = element.scrollTop;
    if (curr >= prev + 10) {
      setIsScrollDown(true);
    } else if (curr < prev - 10) {
      setIsScrollDown(false);
    }
    prev = curr <= offset ? offset : curr;
  }, 50);

  useEffect(() => {
    if (element) {
      element.addEventListener('scroll', handler);
    }
    return () => {
      if (element) {
        element.removeEventListener('scroll', handler);
      }
    };
  }, [element]);

  return isScrollDown;
};
