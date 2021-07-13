import { memo } from 'react';
import LazyLoad from 'react-lazyload';

import PropTypes from 'prop-types';
import { ImageDiv } from './Styled';

// TODO : 혹시나... 웹 접근성 이슈 있으면 수정 (alt)
/**
 * 이미지 태그
 * @param {Boolean} isLazy : Lazy load
 * @param {Object} customStyle : Custom styles
 * @param {String} src : Image URL
 * @param {String} size : background size
 * @param {String} width : Image Width
 * @param {String} height : Image Height
 * @returns
 */
function Image({ isLazy, customStyle, src, size, width, height }) {
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
  isLazy: PropTypes.bool,
  customStyle: PropTypes.object,
  src: PropTypes.string.isRequired,
  size: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default memo(Image);
