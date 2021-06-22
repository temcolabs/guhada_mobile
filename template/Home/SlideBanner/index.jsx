import css from './SlideBanner.module.scss';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import Slider from 'react-slick';
import './SlideBannerSlick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import 'slick-carousel/slick/slick.scss';
import useStores from 'stores/useStores';
import { pushRoute } from 'childs/lib/router';

function SlideBanner() {
  /**
   * states
   */
  const [index, setIndex] = useState(0);
  const { newMain: newMainStore, special: specialStore } = useStores();
  const imageList = newMainStore.mainData.mainBannerList;

  /**
   * side effects
   */
  useEffect(() => {
    const slickDots = document.querySelector('.slickDots');

    if (slickDots) {
      for (let i = 0; i < imageList.length; ++i) {
        slickDots.childNodes[i].style.width = `calc((100% - 38px) / ${
          imageList.length
        })`;
        if (imageList[i].link.includes('special')) {
          const eventIds = imageList[i].link.replace(/[^0-9]/g, '');
          imageList[i].eventIds = eventIds;
        }
      }
    }
  }, [imageList]);

  /**
   * handlers
   */
  const handleBeforeChange = (prevIndex, currIndex) => {
    setIndex(currIndex);
  };

  const handleClick = (image) => {
    image.eventIds
      ? specialStore.toSearch({ eventIds: image.eventIds })
      : pushRoute(image.link);
  };

  /**
   * render
   */
  return (
    <div className={css.wrap}>
      <Slider
        dots
        dotsClass={'slickDots'}
        infinite
        speed={800}
        autoplay
        autoplaySpeed={4000}
        beforeChange={handleBeforeChange}
      >
        {imageList.map(
          (image) =>
            image.mainUse && (
              <img
                className={css.dummyImage}
                src={image.mobileImageUrl}
                key={image.id}
                alt={image.id}
                onClick={() => handleClick(image)}
              />
            )
        )}
      </Slider>
      <div className={css.counter}>{`${index + 1}/${
        imageList.filter((image) => image.mainUse).length
      }`}</div>
    </div>
  );
}

export default observer(SlideBanner);
