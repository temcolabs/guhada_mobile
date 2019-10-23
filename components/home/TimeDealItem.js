import React from 'react';
import css from './TimeDealItem.module.scss';
import cn from 'classnames';

export default function TimeDealItem() {
  return (
    <div className={css.wrap}>
      <div className={css.item}>
        <div className={css.statusWrap}>
          <div className={cn(css.deadLineBtn, css.readyBtn)}>오늘마감</div>
          <div className={css.timeWrap}>10.17 10AM</div>
        </div>
        <div className={css.soldoutImgWrap}>
          <div className={css.soldoutBack} />
          <div className={css.soldoutImg} />
          <div
            className={css.image}
            style={{
              backgroundImage:
                'url(https://d3ikprf0m31yc7.cloudfront.net/images/products/thumb/2cb01338ffd64fee9fb5fe83c8f14c88)',
            }}
          />
        </div>
        <div className={css.detailWrap}>
          <div className={css.brandWrap}>
            <div className={css.brand}>BURBERRY</div>
            <div className={css.season}>19SS</div>
          </div>
          <div className={css.title}>
            버버리 모노그램 프린팅 실크 셔츠 버버리 모노그램
          </div>
          <div className={css.priceItemWrap}>
            <div className={css.priceItem}>
              <div className={css.discountPercent}>80%</div>
              <div className={css.priceWrap}>
                <div className={css.originalPrice}>2,300,000</div>
                <div className={css.discountPricc}>1,259,000원</div>
              </div>
            </div>
            <div className={css.soldout}>품절임박</div>
          </div>
        </div>
      </div>
    </div>
  );
}
