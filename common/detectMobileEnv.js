const getUserAgent = () =>
  navigator.userAgent || navigator.vendor || window.opera;

export const isAndroid = () => {
  const userAgent = getUserAgent();
  return /android/gi.test(userAgent);
};

export const isIOS = () => {
  const userAgent = getUserAgent();
  return /iPad|iPhone|iPod/gi.test(userAgent);
};

export const isWindowsPhone = () => {
  const userAgent = getUserAgent();
  return /windows phone/gi.test(userAgent);
};
