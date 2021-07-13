import { Wrapper, Section, Title, Contents } from './Styled';

/**
 * 럭키드로우 상품이 없는 경우 배너
 * @returns LuckyDrawEmpty
 */
function LuckyDrawEmpty() {
  return (
    <Wrapper>
      <Section>
        <Title>Comming Soon</Title>
        <Contents>
          <p>더욱 풍성한 제품을 준비중입니다.</p>
          <p>다음 럭키드로우를 기대해주세요!</p>
        </Contents>
      </Section>
    </Wrapper>
  );
}

export default LuckyDrawEmpty;
