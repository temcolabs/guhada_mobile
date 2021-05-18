import React from 'react';
import PropTypes from 'prop-types';
import {
  LuckyDrawTopBannerSection,
  LuckyDrawInfoBanner,
  LuckyDrawAttendBanner,
  LuckyDrawWarnInfo,
} from './Styled';

import LuckyDrawButton from 'components/atoms/Button/LuckyDrawButton';

/**
 * 럭키드로우 하단 설명 배너
 * @param {Function} {onClickShareButton 이벤트 공유하기
 * @param {Function} onClickWarnButton} 이벤트 유의사항
 * @returns
 */
function LuckyDrawBottomInfo({ onClickShareButton, onClickWarnButton }) {
  return (
    <LuckyDrawTopBannerSection>
      <LuckyDrawInfoBanner />
      <LuckyDrawAttendBanner />
      <div style={{margin: '0 20px'}}>
        <LuckyDrawButton
          isActive={true}
          contents={'이벤트 공유하기'}
          onClick={onClickShareButton}
        />
      </div>
      <LuckyDrawWarnInfo onClick={onClickWarnButton}>
        유의사항
      </LuckyDrawWarnInfo>
    </LuckyDrawTopBannerSection>
  );
}

LuckyDrawBottomInfo.propTypes = {
  onClickShareButton: PropTypes.func,
  onClickWarnButton: PropTypes.func,
};

export default LuckyDrawBottomInfo;
