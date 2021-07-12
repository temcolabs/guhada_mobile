import React, { memo, Component } from 'react';
import css from './AdBanner.module.scss';
// import './AdBanner.scss';
import cn from 'classnames';
import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.scss';
// import 'slick-carousel/slick/slick-theme.scss';
import { pushRoute } from 'lib/router';
import { inject, observer } from 'mobx-react';
import isTruthy from 'lib/common/isTruthy';

function NextArrow(props) {
  return null;
}

function PrevArrow(props) {
  return null;
}

@inject('main')
@observer
class AdBanner extends Component {
  componentDidMount() {
    //배너 데이터 호출
    this.props.main.getMainBannner();
  }
  render() {
    const { main, dots } = this.props;
    const settings = {
      dots: dots !== undefined ? dots : true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: 'linear',
      dotsClass: 'adBannerDot',
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      // beforeChange: this.onBeforeChange,
    };

    return (
      <div className={css.wrap}>
        <Slider {...settings}>
          {main.bannerInfo.map((banner, index) => {
            if (isTruthy(banner.communityPlusImageUrl))
              return (
                <div key={index}>
                  <div
                    className={cn(css.banner, {
                      [css.href]: banner.link !== '/',
                    })}
                    style={{
                      backgroundImage: `url(${banner.communityPlusImageUrl})`,
                    }}
                    onClick={() =>
                      banner.href !== '/' ? pushRoute(banner.link) : null
                    }
                  />
                </div>
              );
            else return null;
          })}
        </Slider>
      </div>
    );
  }
}

export default memo(AdBanner);
