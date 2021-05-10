import React from 'react';
import PropTypes from 'prop-types';

import { Wrppaer } from './Styled';

/**
 * 리뷰 > 상단 배너
 * @param {Array} banners
 * @returns
 */
function ReviewBanner({ banners }) {
  return <Wrppaer>{/* TODO : 구현 예정 */}</Wrppaer>;
}

ReviewBanner.propTypes = {
  banners: PropTypes.array,
};

export default ReviewBanner;
