import { isBrowser } from 'childs/lib/common/isServer';

/**
 * Sets a cookie if window object is available
 *
 * @param {string} cname cookie name
 * @param {string} cvalue cookie value
 * @param {number} seconds seconds before expire - default value is 60
 */
export function setCookie(cname, cvalue, seconds = 60) {
  if (isBrowser) {
    var d = new Date();
    d.setTime(d.getTime() + seconds * 1000);
    document.cookie =
      cname + '=' + escape(cvalue) + ';expires=' + d.toUTCString() + ';path=/';
  }
}

/**
 * Get the cookie value from the request header
 *
 * @param {string} cname cookie name
 * @param {string} cookieString cookie string object from the request header
 * @returns cookie value
 */
export function getCookie(cname, cookieString) {
  var cvalue = '';
  if (cookieString.length) {
    var decodedCookies = decodeURIComponent(cookieString);
    var array = decodedCookies.split(escape(cname) + '=');
    if (array.length >= 2) {
      var subArray = array[1].split(';');
      cvalue = unescape(subArray[0]);
    }
  }
  return cvalue;
}
