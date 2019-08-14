import React, { Component } from 'react';
import css from './MainSlideBanner.module.scss';
import './MainSlideBanner.scss';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';
import cn from 'classnames';

function NextArrow(props) {
  const { style, onClick } = props;
  return (
    <div className={cn(css.nextArrow)} style={{ ...style }} onClick={onClick} />
  );
}

function PrevArrow(props) {
  const { style, onClick } = props;
  return (
    <div className={cn(css.prevArrow)} style={{ ...style }} onClick={onClick} />
  );
}

export class MainSlideBanner extends Component {
  state = {
    index: 0,
  };

  onBeforeChange = (oldIndex, newIndex) => {
    this.setState({ index: newIndex });
  };

  render() {
    const settings = {
      // dots: true,
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: 'linear',
      // dotsClass: 'slickDots',
      // nextArrow: <NextArrow />,
      // prevArrow: <PrevArrow />,
      // beforeChange: this.onBeforeChange,
    };
    const { imageFile } = this.props;

    return (
      <div className={css.wrap}>
        <Slider {...settings}>
          {imageFile.map((image, index) => {
            return (
              <img className={css.dummyImage} src={image} key={index} alt="" />
            );
          })}
        </Slider>
        <div className={css.counter}>{`${this.state.index + 1}/${
          imageFile.length
        }`}</div>
      </div>
    );
  }
}

export default MainSlideBanner;
