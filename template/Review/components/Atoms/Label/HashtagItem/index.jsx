import React, { memo } from 'react';
import PropTypes from 'prop-types';

import Image from 'components/atoms/Image';
import { Wrapper } from './Styled';

const IMAGE_PATH = {
  delIcon: '/static/icon/shipping/pc-popup-icon-del.png',
};

/**
 * Hashtag Item
 * @param {String} hashtag
 * @returns
 */
function HashTagItem({ isClose, hashtag, onClickHashtag }) {
  return (
    <Wrapper onClick={onClickHashtag}>
      # {hashtag}{' '}
      {isClose && (
        <Image isLazy={true} src={IMAGE_PATH.delIcon} width={'16px'} height={'16px'} />
      )}
    </Wrapper>
  );
}

HashTagItem.propTypes = {
  hashtag: PropTypes.string.isRequired,
  onClickHashtag: PropTypes.func,
};

export default memo(HashTagItem);
