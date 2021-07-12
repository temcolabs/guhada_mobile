import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import css from './Gallery.module.scss';

import Slider from 'react-slick';

@inject('productdetail', 'productDetailGallery', 'productDetailBookmark')
@observer
class Gallery extends Component {
  state = {
    activeSlide: 1,
  };
  componentDidMount() {
    this.props.productDetailGallery.addGalleryImage();
  }

  render() {
    let { productdetail, productDetailBookmark } = this.props;
    let settings = {
      dots: false,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      pauseOnFocus: true,
      swipeToSlide: true,
      adaptiveHeight: false,
      beforeChange: (current, next) => this.setState({ activeSlide: next + 1 }),
    };
    return (
      <div className={css.detail__gallery}>
        <Slider {...settings}>
          {productdetail.deals.imageUrls?.map((data, index) => {
            return (
              <div key={index} className={css.detailImage}>
                <div style={{ backgroundImage: `url(${data})` }} />
              </div>
            );
          })}
        </Slider>
        <div className={css.index__box}>
          {`${this.state.activeSlide} / ${productdetail.deals.imageUrls?.length} `}
        </div>

        {productDetailBookmark.bookMarkAdd === 'on' ? (
          <div className={css.bookmark}>
            <i
              style={{
                backgroundImage: `url('/public/icon/bookmark-w-btn-on@3x.png')`,
              }}
            />
            <p className={css.text}>찜하기 완료</p>
          </div>
        ) : null}

        {productDetailBookmark.bookMarkAdd === 'off' ? (
          <div className={css.bookmark}>
            <i
              style={{
                backgroundImage: `url('/public/icon/bookmark-w-btn-off@3x.png')`,
              }}
            />
            <p className={css.text}>찜하기 해제</p>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Gallery;
