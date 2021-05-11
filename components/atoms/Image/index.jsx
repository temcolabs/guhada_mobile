import React from 'react';
import LazyLoad from 'react-lazyload';

import PropTypes from 'prop-types';
import { ImageDiv } from './Styled';

/**
 * 이미지 태그
 * @param {String} type : block, image
 * @param {String} src : Image URL
 * @param {String} size : background size
 * @param {String} width : Image Width
 * @param {String} height : Image Height
 * @returns
 */
function Image({ type, src, size, width, height }) {
  return (
    <>
      <LazyLoad>
        {/* TODO : image 태그 형태 필요하면, 만들기 */}
        <ImageDiv style={{ width, height }} src={src} size={size} />
      </LazyLoad>
    </>
  );
}

Image.propTypes = {
  type: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Image;
