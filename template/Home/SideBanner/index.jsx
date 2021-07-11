import css from './SideBanner.module.scss';
// import './SideBannerSlick.scss';
import { memo } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Image from 'components/atoms/Image/HomeImage';

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
        dotsClass={'slick-dots side-banner__slick-dots'}
        infinite={false}
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}
      >
        {imageList.map((image) => (
          <Image
            key={image.orderBy}
            src={image.mainBannerMobileUrl}
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
