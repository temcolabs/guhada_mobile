import React from 'react';
import css from './SectionItem.module.scss';
import cn from 'classnames';

export default function SectionItem({
  item = {
    brandId: 0,
    brandName: '',
    categoryId: 0,
    dealId: 0,
    dealName: '',
    discountPrice: 0,
    discountRate: 0,
    freeShipping: true,
    productImage: {
      height: 0,
      name: '',
      url: '',
      width: 0,
    },
    options: [
      { type: '', attributes: [''] },
      { type: '', attributes: [''] },
      { type: '', attributes: [''] },
    ],
    productId: 0,
    productName: '',
    productSeason: '',
    searchField: '',
    sellPrice: 0,
    sellerId: 0,
    sellerName: '',
    setDiscount: false,
  },
}) {
  return (
    <div className={css.wrap}>
      <div className={css.imageWrap}>
        <div className={css.freeShipping}>
          무료<br />배송
        </div>
        <img src={item.productImage.url} alt={item.productImage.name} />
      </div>
      <div className={css.contentWrap}>
        <div className={css.brandWrap}>
          <div className={css.brandName}>{item.brandName}</div>
          <div className={css.productSeason}>{item.productSeason}</div>
        </div>
        <div className={css.dealName}>{item.dealName}</div>
        {item.discountRate > 0 ? (
          <div className={css.priceWrap}>
            <span className={css.sellPrice}>
              {item.discountPrice.toLocaleString()}
            </span>
            <span className={css.discountPrice}>
              {item.sellPrice !== 0 ? item.sellPrice.toLocaleString() : null}
            </span>
            <span className={css.discountRate}>
              {item.discountRate !== 0 ? `${item.discountRate}%` : null}
            </span>
          </div>
        ) : (
          <div className={css.priceWrap}>
            <span className={css.sellPrice}>
              {`${item.sellPrice.toLocaleString()}`}
            </span>
          </div>
        )}
        <div className={css.sellerWrap}>
          <div className={css.sellerLevel}>
            <div className={css.level}>{1}</div>
          </div>
          <span className={css.sellerName}>{item.sellerName}</span>
        </div>
      </div>
    </div>
  );
}
