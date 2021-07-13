import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { LuckyDrawHistoryItem } from 'template/LuckyDraw/components/molecules';

import { Wrapper, Title, SliderSection } from './Styled';

/**
 * 럭키 드로우 히스토리
 * @param {Object []} winnerList 당첨자 히스토리 리스트
 * @returns
 */
function LuckyDrawHistory({ winnerList, onClickHistory }) {
  /**
   * states
   */
  const [scrollMenuData, setScrollMenuData] = useState([]);

  /**
   * side effects
   */
  useEffect(() => {
    if (winnerList && winnerList.length) {
      createScrollMenuData(winnerList);
    }
    return () => {
      setScrollMenuData([]);
    };
  }, [winnerList]);

  /**
   * helpers
   */
  const createScrollMenuData = useCallback(
    (winnerList) => {
      if (winnerList && winnerList.length) {
        const result = [];
        winnerList.forEach((o, i) =>
          result.push(
            <LuckyDrawHistoryItem
              key={`LuckyDrawHistoryItem-${i}`}
              item={o}
              onClickHistory={() => onClickHistory(o.dealId)}
            />
          )
        );
        setScrollMenuData(result);
      }
    },
    [winnerList]
  );

  /**
   * render
   */
  return (
    <Wrapper>
      <Title>DRAW HISTORY</Title>
      {/* 럭키드로우 아이템 슬라이더 */}
      <SliderSection>
        {scrollMenuData && scrollMenuData.length && (
          <ScrollMenu data={scrollMenuData} wheel={false} />
        )}
      </SliderSection>
      {/* TODO : 럭키드로우 아이템 스크롤 */}
    </Wrapper>
  );
}

LuckyDrawHistory.propTypes = {
  winnerList: PropTypes.arrayOf(PropTypes.object),
  onClickHistory: PropTypes.func.isRequired,
};

export default LuckyDrawHistory;
