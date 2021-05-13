import { memo } from 'react';
import { Wrapper, Title, Contents } from './Styled';

function CardContents({ title, contents }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Contents>{contents}</Contents>
    </Wrapper>
  );
}

CardContents.propTypes = {};

export default memo(CardContents);
