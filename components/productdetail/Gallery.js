import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Gallery.module.scss';

import Slider from 'react-slick';

@inject('productdetail', 'productDetailGallery')
@observer
class Gallery extends Component {
  state = {
    activeSlide: 1,
  };
  componentDidMount() {
    this.props.productDetailGallery.addGalleryImage();
  }

  render() {
    let { productdetail } = this.props;
    let settings = {
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false,
      pauseOnFocus: true,
      swipeToSlide: true,

      beforeChange: (current, next) => this.setState({ activeSlide: next + 1 }),
    };
    return (
      <div className={css.detail__gallery}>
        <Slider {...settings}>
          {productdetail.deals.imageUrls.map((data, index) => {
            return (
              <div key={index}>
                <img src={data} alt="상세이미지" />
              </div>
            );
          })}
        </Slider>
        <div className={css.index__box}>
          {`${this.state.activeSlide} / ${productdetail.deals.imageUrls.length} `}
        </div>
      </div>
    );
  }
}

export default Gallery;
