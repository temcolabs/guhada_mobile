import React, { memo, useRef, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Slider from 'components/molecules/Slider';
import Image from 'components/atoms/Image';
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
  const sliderWrapper = useRef(null);

  /**
   * Changed slider dots position
   */
  useEffect(() => {
    if (sliderWrapper.current && type === 'FOCUS_ON') {
      let sliders = sliderWrapper.current.querySelectorAll('.slider-wrap');

      if (sliders && sliders.length) {
        sliders.forEach((o) => {
          o.style.height = '394px';
        });
      }
    }
  }, [sliderWrapper.current]);

  return (
    <Wrapper>
      {title ? <TitleSection>{title}</TitleSection> : ''}
      <SliderWrapper ref={sliderWrapper} type={type}>
        <Slider settings={settings}>
          {list && list.length
            ? list.map((o, i) => (
                <a
                  className={'slider-wrap'}
                  key={`focus-on-${i}`}
                  href={o.mainBannerLinkUrl}
                >
                  {type === 'FOCUS_ON' && <Image src={o.mainBannerMobileUrl} />}
                  {type === 'OTHERS' && (
                    <img
                      style={{ maxWidth: '100%' }}
                      alt={'focus on list'}
                      src={o.mainBannerMobileUrl}
                    />
                  )}
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