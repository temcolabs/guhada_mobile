import React from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './Styled';

/**
 * Hashtag Item
 * @param {String} hashtag
 * @returns
 */
function HashTagItem({ hashtag, onClickHashtag }) {
  return <Wrapper onClick={onClickHashtag}># {hashtag}</Wrapper>;
}

HashTagItem.propTypes = {
  hashtag: PropTypes.string.isRequired,
  onClickHashtag: PropTypes.func,
};

export default HashTagItem;
