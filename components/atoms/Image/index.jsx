import { memo } from 'react';
import LazyLoad from 'react-lazyload';

import PropTypes from 'prop-types';
import { ImageDiv } from './Styled';

/**
 * 이미지 태그
 * @param {Boolean} isLazy : Lazy load
 * @param {Object} customStyle : Custom styles
 * @param {String} type : block, image
 * @param {String} src : Image URL
 * @param {String} size : background size
 * @param {String} width : Image Width
 * @param {String} height : Image Height
 * @returns
 */
function Image({ isLazy, customStyle, type, src, size, width, height }) {
  return (
    <>
      {isLazy ? (
        <LazyLoad>
          <ImageDiv
            style={customStyle}
            width={width}
            height={height}
            src={src}
            size={size}
          />
        </LazyLoad>
      ) : (
        <ImageDiv
          style={customStyle}
          width={width}
          height={height}
          src={src}
          size={size}
        />
      )}
    </>
  );
}

Image.propTypes = {
  type: PropTypes.string,
  customStyle: PropTypes.object,
  src: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default memo(Image);
