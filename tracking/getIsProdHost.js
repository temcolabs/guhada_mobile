const getIsProdHost = () => {
  if (isBrowser) {
    const { isTablet, isMobile } = detectDevice();
    const hostname = window.location.hostname;

    return isTablet || isMobile
      ? // 모바일 prod 호스트 확인
        hostname === "m.guhada.com"
      : // 데스크탑 prod 호스트
        hostname === "www.guhada.com" ||
          hostname === "web.guhada.com" ||
          hostname === "guhada.com";
  } else {
    return false;
  }
};

export default getIsProdHost;
