import _ from 'lodash';

export function getEscapedBody(body) {
  for (let key in body) {
    if (Array.isArray(body[key])) {
      for (let i = 0; i < body[key].length; ++i) {
        if (typeof body[key][i] !== 'number') {
          body[key][i] = _.escape(
            body[key][i]
              .toString()
              .slice(0, 50)
              .trim()
              .replace(/ {2,}/g, ' ')
          );
        }
      }
    } else {
      if (typeof body[key] !== 'number') {
        body[key] = _.escape(
          body[key]
            .toString()
            .slice(0, 50)
            .trim()
            .replace(/ {2,}/g, ' ')
        );
      }
    }
  }
}
