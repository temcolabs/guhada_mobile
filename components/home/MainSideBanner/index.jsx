import React, { memo, useRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Slider from 'components/molecules/Slider';
import { Wrapper, TitleSection, SliderWrapper } from './Styled';

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

/**
 * 메인 본문 배너
 * @param {Number} type, 1 : FOCUS_ON, 2 : OTHERS
 * @param {String} title, 제목
 * @param {Array} list, 슬라이드 리스트
 * @returns
 */
function MainSideBanner({ type = 'OTHERS', title, list }) {
  const [sliderHeight, setSliderHeight] = useState(0);
  const sliderWrapper = useRef(null);

  /**
   * Changed slider dots position
   */
  useEffect(() => {
    if (sliderWrapper.current && type === 'FOCUS_ON') {
      const slickDots = sliderWrapper.current.querySelector('.slick-dots');
      if (slickDots) {
        const imageHeight = sliderWrapper.current.clientHeight;
        const dotsHeight = slickDots.clientHeight;
        setSliderHeight(imageHeight + dotsHeight);
      }
    }
  }, [sliderWrapper.current]);

  return (
    <Wrapper>
      {title ? <TitleSection>{title}</TitleSection> : ''}
      <SliderWrapper ref={sliderWrapper} type={type} bottom={sliderHeight}>
        <Slider settings={settings}>
          {list && list.length
            ? list.map((o, i) => (
                <a key={`focus-on-${i}`} href={o.mainBannerLinkUrl}>
                  <img
                    style={{ maxWidth: '100%' }}
                    alt={'focus on list'}
                    src={o.mainBannerMobileUrl}
                  />
                </a>
              ))
            : ''}
        </Slider>
      </SliderWrapper>
    </Wrapper>
  );
}

MainSideBanner.propTypes = {
  list: PropTypes.object,
};

export default memo(observer(MainSideBanner));
