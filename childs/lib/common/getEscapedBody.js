import { escape as _escape } from 'lodash';

export function getEscapedBody(body) {
  for (let key in body) {
    if (Array.isArray(body[key])) {
      for (let i = 0; i < body[key].length; ++i) {
        body[key][i] = _escape(
          body[key][i]
            .toString()
            .slice(0, 50)
            .trim()
            .replace(/ {2,}/g, ' ')
        );
      }
    } else {
      body[key] = _escape(
        body[key]
          .toString()
          .slice(0, 50)
          .trim()
          .replace(/ {2,}/g, ' ')
      );
    }
  }
}
