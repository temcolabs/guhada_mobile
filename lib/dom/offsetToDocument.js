/**
 * document 전체적인 상대 위치
 * @param {*} el
 */
export default function offsetToDocument(el) {
  if (el) {
    const rect = el.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  } else {
    console.error('offsetToDocument: no element');
    return {};
  }
}
