import PropTypes from 'prop-types';
import { Wrapper, Title, Contents } from './Styled';

/**
 * 리뷰 > 본문 > 타이틀, 내용
 * @param {String} title
 * @param {String} contents
 * @returns
 */
function CardContents({ title, contents }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Contents>{contents}</Contents>
    </Wrapper>
  );
}

CardContents.propTypes = {
  title: PropTypes.string,
  contents: PropTypes.string,
};

export default CardContents;
