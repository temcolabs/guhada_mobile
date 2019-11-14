import React from 'react';

/**
 * 개행문자가 있는 문자열에 JSX br 태그를 추가해서 리턴한다
 *
 * @param  {[String]} lines [description]
 * @return {[JSX]}       [description]
 */
const jsxTextLineBreak = lines => {
  return lines
    ? lines.split(/[\r\n]/).map(
        (partial, i) =>
          partial && (
            <span key={i}>
              {partial}
              {i !== lines.length - 1 && <br />}
            </span>
          )
      )
    : lines;
};

export default jsxTextLineBreak;
