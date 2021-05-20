import { memo, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Image from 'components/atoms/Image';
import Slider from 'components/molecules/Slider';

import { Wrapper, ImageSection } from './Styled';
import React from 'react';

const settings = {
  arrows: false,
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
};

/**
 * 리뷰 > 이미지 Section
 * @param {String} type, list, detail
 * @param {Array} images, 이미지 리스트
 * @returns
 */
function CardImage({ isLazy = false, type = 'list', images }) {
  /**
   * states
   */
  const sliderRef = useRef(null);

  /**
   * side effect
   */
  useEffect(() => {
    if (sliderRef.current) {
      if (type === 'list') initStyleTypeList();
      else if (type === 'detail') initStyleTypeDetail();
    }
  }, [sliderRef.current]);

  /**
   * helpers
   */

  // Review List 초기화
  const initStyleTypeList = () => {
    let slickSlides = sliderRef.current.querySelectorAll('.slick-slide');
    let slickTracks = sliderRef.current.querySelectorAll('.slick-track');
    if (slickSlides && slickSlides.length) {
      slickSlides.forEach((o, i) => {
        o.style.marginRight = '7px';
      });
    }

    if (slickTracks && slickTracks.length) {
      slickTracks.forEach((o, i) => {
        o.style.margin = '0 20px';
      });
    }
  };

  // Review Detail 초기화
  const initStyleTypeDetail = () => {
    let slickDots = sliderRef.current.querySelectorAll('.slick-dots');
    if (slickDots && slickDots.length) {
      slickDots.forEach((o1, i) => {
        o1.style.bottom = '-38px';

        let li = o1.querySelectorAll('li');
        if (li && li.length) {
          li.forEach((o2) => {
            o2.style.margin = '0';
          });
        }
      });
    }
  };

  const createReviewImages = useCallback(
    (images) => {
      return images && images.length
        ? images.map((src, i) => (
            <div
              key={`createReviewImages-${i}`}
              style={{ width: type === 'list' ? '320px' : 'inherit' }}
            >
              <Image
                isLazy={isLazy}
                src={src}
                width={'auto'}
                height={'320px'}
              />
            </div>
          ))
        : '';
    },
    [images]
  );

  return (
    <Wrapper>
      {images?.length < 2 ? (
        <ImageSection type={type}>
          <Image
            isLazy={isLazy}
            src={images[0]}
            width={'auto'}
            height={'320px'}
          />
        </ImageSection>
      ) : (
        <div ref={sliderRef}>
          <Slider
            children={createReviewImages(images)}
            settings={{
              ...settings,
              variableWidth: type === 'list' ? true : false,
              dots: type === 'detail' ? true : false,
            }}
          />
        </div>
      )}
    </Wrapper>
  );
}

CardImage.propTypes = {
  type: PropTypes.string,
  images: PropTypes.array.isRequired,
};

export default memo(CardImage);
