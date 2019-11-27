/**
 * 한영 문자열을 파악해서
 * byte 단위로 문자열을 자른다.
 * @param {string} str
 * @param {number} maxByte
 */

function cutByLen(str, maxByte) {
  let b, i, c;
  for (b = i = 0; (c = str.charCodeAt(i)); ) {
    b += c >> 7 ? 2 : 1;

    if (b > maxByte) break;

    i++;
  }

  return str.substring(0, i);
}

export default cutByLen;
