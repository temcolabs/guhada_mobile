import React from 'react';
import PropTypes from 'prop-types';
import Constants from './Constants';

/**
 * EMOJI
 *  @param THUMBS_UP: { '👍',
 *  @param CLAPPING_HANDS: '👏',
 *  @param RAISING_HANDS: '🙌',
 *  @param FOLDED_HANDS: '🙏',
 *  @param SMILING_FACE_WITH_EYES: '😊',
 *  @param SMILING_FACE_WITH_HEART_EYES: '😍',
 *  @param SMILING_FACE_WITH_SUNGLASSES: '😎',
 *  @param RED_HEART: '💖' }
 * @returns
 */
function Emoji({ symbol, className, style, onClickEmoji }) {
  return (
    <span
      role="img"
      className={className}
      style={style}
      onClick={() => onClickEmoji(Constants[symbol])}
    >
      {Constants[symbol]}
    </span>
  );
}

Emoji.propTypes = {
  symbol: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClickEmoji: PropTypes.func,
};

export default Emoji;
