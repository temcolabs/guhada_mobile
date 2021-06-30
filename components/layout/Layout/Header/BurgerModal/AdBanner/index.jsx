import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Slider from 'react-slick';
import './AdBannerSlick.scss';
import useStores from 'stores/useStores';
import { pushRoute } from 'childs/lib/router';

const AdImage = ({ backgroundColor, src, onClick }) => (
  <div
    style={{ backgroundImage: `url('${src}')`, backgroundColor }}
    onClick={onClick}
  />
);
function AdBanner({ handleBeforeClick }) {
  /**
   * states
   */
  const { newMain: newMainStore, special: specialStore } = useStores();
  const imageList = newMainStore.mainData.mainBannerList;

  /**
   * side effects
   */
  useEffect(() => {
    for (let i = 0; i < imageList.length; ++i) {
      if (imageList[i].link.includes('special')) {
        const eventIds = imageList[i].link.replace(/[^0-9]/g, '');
        imageList[i].eventIds = eventIds;
      }
    }
  }, []);

  /**
   * handlers
   */
  const handleClick = (image) => {
    image.eventIds
      ? specialStore.toSearch({ eventIds: image.eventIds })
      : pushRoute(image.link);
    handleBeforeClick();
  };

  /**
   * render
   */
  return (
    <Slider
      dots
      className={'ad-banner__slick'}
      dotsClass={'slick-dots ad-banner__slick-dots'}
      centerMode
      arrows={false}
      centerPadding={'20px'}
      speed={500}
      autoplay
      autoplaySpeed={4000}
      slidesToShow={1}
    >
      {imageList.map(
        (image) =>
          image.mainUse &&
          image.communityPlusImageUrl && (
            <AdImage
              key={image.id}
              src={image.communityPlusImageUrl}
              backgroundColor={image.backgroundColor}
              onClick={() => handleClick(image)}
            />
          )
      )}
    </Slider>
  );
}

AdBanner.propTypes = {
  handleBeforeClick: PropTypes.func,
};

export default observer(AdBanner);
