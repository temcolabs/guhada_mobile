import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, Item } from './Styled';

/**
 * 리뷰 > 상세 > Label
 * @param {Array} answers
 * @param {Array} questions
 * @returns 
 */
function ReviewLabels({ answers, questions }) {
  return (
    <Wrapper>
      {questions && questions.length
        ? questions.map((o, i) => (
            <Item>
              <div>{o.type}</div>
              <div>{answers[i].answer}</div>
            </Item>
          ))
        : ''}
    </Wrapper>
  );
}

ReviewLabels.propTypes = {};

export default ReviewLabels;
