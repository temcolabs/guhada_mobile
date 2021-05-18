import React, { Component } from 'react';
import css from './MainSlideBanner.module.scss';
import './MainSlideBanner.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import { pushRoute } from 'childs/lib/router';
import { inject } from 'mobx-react';

@inject('special')
class MainSlideBanner extends Component {
  state = {
    index: 0,
  };

  componentDidMount() {
    const { imageFile } = this.props;
    let imageLength = imageFile.filter((image) => image.mainUse === true)
      .length;

    if (document.querySelector('.slickDots')) {
      let li = document.querySelector('.slickDots').childNodes;

      for (let i = 0; i < imageLength; i++) {
        li[i].style.width = `calc((100% - 38px) / ${imageLength})`;
        if (imageFile[i].link.includes('special')) {
          let eventIds = imageFile[i].link.replace(/[^0-9]/g, '');
          imageFile[i].eventIds = eventIds;
        }
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { imageFile } = this.props;
    if (prevProps.imageFile !== this.props.imageFile) {
      for (let i = 0; i < imageFile.length; i++) {
        if (imageFile[i].link.includes('special')) {
          let eventIds = imageFile[i].link.replace(/[^0-9]/g, '');
          imageFile[i].eventIds = eventIds;
        }
      }
    }
  }

  onBeforeChange = (oldIndex, newIndex) => {
    this.setState({ index: newIndex });
  };

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: 'linear',
      dotsClass: 'slickDots',
      beforeChange: this.onBeforeChange,
    };
    const { imageFile, special } = this.props;

    return (
      <div className={css.wrap}>
        <Slider {...settings}>
          {imageFile.map((image, index) => {
            if (image.mainUse)
              return (
                <img
                  className={css.dummyImage}
                  src={image.mobileImageUrl}
                  key={index}
                  alt={`banner${index}`}
                  onClick={
                    image.eventIds
                      ? () => special.toSearch({ eventIds: image.eventIds })
                      : () => pushRoute(image.link)
                  }
                />
              );
            else return null;
          })}
        </Slider>
        <div className={css.counter}>{`${this.state.index + 1}/${
          imageFile.filter((image) => image.mainUse === true).length
        }`}</div>
      </div>
    );
  }
}

export default MainSlideBanner;
