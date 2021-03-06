import css from './FocusOnBanner.module.scss';
import './FocusOnBannerSlick.scss';
import { observer } from 'mobx-react';
import Slider from 'react-slick';
import useStores from 'stores/useStores';
import Image from 'components/atoms/Image/HomeImage';

function FocusOnBanner() {
  /**
   * states
   */
  const { newMain: newMainStore } = useStores();
  const imageList = newMainStore.mainData.mainImageSetOneSetList;

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
    <section className={css['section']}>
      <h2 className={css['section__header']}>FOCUS ON</h2>
      <div className={css['section__slider']}>
        <Slider
          dots
          dotsClass={'slick-dots focus-on__slick-dots'}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {imageList.map((image) => (
            <Image
              fixedHeight
              src={image.mainBannerMobileUrl}
              key={image.orderBy}
              onClick={() => handleClick(image)}
            />
          ))}
        </Slider>
      </div>
    </section>
  );
}

export default observer(FocusOnBanner);
