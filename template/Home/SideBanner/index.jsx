import css from './SideBanner.module.scss';
import cn from 'classnames';
import { memo } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';

function SideBanner({ imageList = [] }) {
  /**
   * handlers
   */
  const handleClick = (image) => {
    if (image.mainBannerLinkUrl) {
      window.location = image.mainBannerLinkUrl;
    }
  };

  /**
   * render
   */
  return (
    <div className={css['section']}>
      <Slider
        dots
        dotsClass={cn('slick-dots', css['dots'])}
        infinite={false}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
      >
        {imageList.map((image) => (
          <img
            src={image.mainBannerMobileUrl}
            style={{ maxWidth: '100%' }}
            key={image.createdAt}
            onClick={() => handleClick(image)}
          />
        ))}
      </Slider>
    </div>
  );
}

SideBanner.propTypes = {
  imageList: PropTypes.object,
};

export default memo(SideBanner);
