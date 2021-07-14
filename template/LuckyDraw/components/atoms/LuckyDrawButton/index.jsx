import { memo } from 'react';
import PropTypes from 'prop-types';
import css from './LuckyDrawButton.module.scss';

/**
 * 럭키드로우 Submit
 * @param {Boolean} isActive : 버튼 활성화 여부
 * @param {String} contents : 버튼 내용
 * @param {Function} onClick : 버튼 이벤트
 * @returns
 */
function LuckyDrawButton({ isActive, contents, onClick }) {
  return (
    <button
      style={{ backgroundColor: isActive ? '#232323' : '#ccc' }}
      className={css.button}
      disabled={!isActive}
      onClick={onClick}
    >
      {contents}
    </button>
  );
}

LuckyDrawButton.propTypes = {
  isActive: PropTypes.bool,
  contents: PropTypes.string,
  onClick: PropTypes.func,
};

export default memo(LuckyDrawButton);
