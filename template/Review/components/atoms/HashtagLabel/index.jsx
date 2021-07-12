import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Image from 'components/atoms/Image';
import { Wrapper } from './Styled';

const IMAGE_PATH = {
  delIcon: '/public/icon/shipping/pc-popup-icon-del.png',
};

/**
 * Hashtag Item
 * @param {Boolean} isClose
 * @param {String} hashtag
 * @param {Function} onClickHashtag
 * @returns
 */
function HashtagLabel({ isClose, hashtag, onClickHashtag }) {
  return (
    <Wrapper onClick={onClickHashtag}>
      # {hashtag}{' '}
      {isClose && (
        <Image
          isLazy={true}
          src={IMAGE_PATH.delIcon}
          width={'16px'}
          height={'16px'}
        />
      )}
    </Wrapper>
  );
}

HashtagLabel.propTypes = {
  isClose: PropTypes.bool,
  hashtag: PropTypes.string.isRequired,
  onClickHashtag: PropTypes.func,
};

export default memo(HashtagLabel);
