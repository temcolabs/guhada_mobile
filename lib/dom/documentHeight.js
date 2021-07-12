import canUseDOM from './canUseDOM';

/**
 * 현재 페이지 전체 높이
 */
export default function documentHeight() {
  if (canUseDOM()) {
    const body = document.body,
      html = document.documentElement;

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    return height;
  } else {
    return null;
  }
}

/**
 * 현재 페이지 전체 넓이
 */
export function documentWidth() {
  if (canUseDOM()) {
    const body = document.body,
      html = document.documentElement;

    const width = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    );

    return width;
  } else {
    return null;
  }
}
