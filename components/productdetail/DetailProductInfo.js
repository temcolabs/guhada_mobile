import React, { Component } from 'react';
import css from './DetailProductInfo.module.scss';

class DetailProductInfo extends Component {
  render() {
    return (
      <div className={css.wrap}>
        <div className={css.inner__top}>
          <div className={css.brandName}>
            ACNE STUDIOS
            <span className={css.arrow}></span>
          </div>
          <div className={css.detail__number}>73774646172</div>
        </div>

        <div className={css.inner__middle}>
          <div className={css.product__name}>
            19SS 라이트 핑크 허리 디테일 그레이 솔리드 아웃 포켓 브이넥
          </div>
        </div>
      </div>
    );
  }
}

export default DetailProductInfo;
