import React from 'react';
import PropTypes from 'prop-types';

import {
  Wrapper,
  ImageSection,
  ImageSectionCover,
  Image,
  WinnerDate,
  WinnerSubmit,
} from './Styled';
import moment from 'moment';

/**
 * 럭키드로우 Draw history
 * @param {Boolean} isActive Inner item visible
 * @param {Object} item Luckydarw history item
 * @param {Function} onClickHistory Winner history event
 * @returns
 */
function LuckyDrawHistoryItem({ isActive, item, onClickHistory }) {
  return (
    <Wrapper>
      {isActive && (
        <>
          <ImageSection bgColor={item.bgColor}>
            <Image src={item.imageUrl} alt="Draw Item Image" />
            <ImageSectionCover />
            <WinnerDate>
              <p>발표일</p>
              <p>{moment(item.winnerAnnouncementAt).format('YYYY. MM. DD')}</p>
            </WinnerDate>
          </ImageSection>
          <WinnerSubmit onClick={() => onClickHistory(item.dealId)}>
            당첨자 확인
          </WinnerSubmit>
        </>
      )}
    </Wrapper>
  );
}

LuckyDrawHistoryItem.propTypes = {
  isActive: PropTypes.bool,
  winners: PropTypes.arrayOf(PropTypes.object),
  onClickHistory: PropTypes.func,
};

LuckyDrawHistoryItem.defaultProps = {
  isActive: true,
};

export default LuckyDrawHistoryItem;
