/**
 * 팝업을 브라우저 중앙에 연다. (개발 도구가 닫은 상태에서 정상 작동함)
 * @param {*} url
 * @param {*} title
 * @param {*} w 넓이
 * @param {*} h 높이
 */
export default function openPopupCenter(url, title, w, h) {
  var dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  var dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : window.screen.width;
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : window.screen.height;

  var systemZoom = width / window.screen.availWidth;
  var left = (width - w) / 2 / systemZoom + dualScreenLeft;
  var top = (height - h) / 2 / systemZoom + dualScreenTop;

  var newWindow = window.open(
    url,
    title,
    'scrollbars=yes, width=' +
      w / systemZoom +
      ', height=' +
      h / systemZoom +
      ', top=' +
      top +
      ', left=' +
      left
  );

  // Puts focus on the newWindow
  if (window.focus) newWindow.focus();

  return newWindow;
}
