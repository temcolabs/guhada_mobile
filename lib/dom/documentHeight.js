import { isServer } from 'lib/isServer';

/**
 * 현재 페이지 전체 높이
 */
export default function documentHeight() {
  if (!isServer) {
    const body = document.body,
      html = document.documentElement;

    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    // console.log(`height`, height);

    return height;
  } else {
    return null;
  }
}
