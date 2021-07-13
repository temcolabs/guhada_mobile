import PropTypes from 'prop-types';

import { Wrapper, Item } from './Styled';

/**
 * 리뷰 > 상세 > Label
 * @param {Array} answers // review.reviewAnswers
 * @param {Array} questions // review.reviewQuestions
 * @returns
 */
function ReviewDetailLabelList({ answers, questions }) {
  return (
    <Wrapper>
      {questions && questions.length
        ? questions.map((o, i) => (
            <Item key={`${o.type}-${i}`}>
              <div>{o.type}</div>
              <div>{answers[i].answer}</div>
            </Item>
          ))
        : ''}
    </Wrapper>
  );
}

ReviewDetailLabelList.propTypes = {
  answers: PropTypes.object.isRequired,
  questions: PropTypes.array.isRequired,
};

export default ReviewDetailLabelList;
