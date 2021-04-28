import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper, SectionImage, SectionBg } from './Styled';

/**
 * 럭키드로우 상품 Photo frame
 * @param {String} imageUrl : 상품 이미지
 * @param {String} statusCode : 상품 상태 (NORMAL, READY, START, REQUESTED)
 * @returns
 */
function LuckyDrawCardFrame({ imageUrl, statusCode }) {
  return (
    <Wrapper>
      <SectionImage imageUrl={imageUrl} zIndex={1} />
      {(statusCode === 'NORMAL' || statusCode === 'READY') && (
        <SectionImage
          imageUrl={'/static/icon/luckydraw/comming_soon.png'}
          zIndex={2}
        />
      )}
      <SectionBg />
    </Wrapper>
  );
}

LuckyDrawCardFrame.propTypes = {
  imageUrl: PropTypes.string,
  statusCode: PropTypes.string,
};

export default LuckyDrawCardFrame;
