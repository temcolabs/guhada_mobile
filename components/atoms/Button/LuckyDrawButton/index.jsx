import React from 'react';
import PropTypes from 'prop-types';
import { Button } from './Styled';

/**
 * 럭키드로우 Submit
 * @param {Boolean} isActive : 버튼 활성화 여부
 * @param {String} contents : 버튼 내용
 * @param {Function} onClick : 버튼 이벤트
 * @returns
 */
function LuckyDrawButton({ isActive, contents, onClick }) {
  return (
    <Button disabled={!isActive} 
      onClick={onClick} 
      isActive={isActive}>
      {contents}
    </Button>
  );
}

LuckyDrawButton.propTypes = {
  isActive: PropTypes.bool,
  contents: PropTypes.string,
  onClick: PropTypes.func
};

export default LuckyDrawButton;
