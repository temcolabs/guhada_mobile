import React from 'react';
import css from './SectionItem.module.scss';
import cn from 'classnames';

export default function SectionItem({
  item = {
    brandId: 592,
    brandName: 'JAMESPERSE',
    categoryId: 234,
    dealId: 2733,
    dealName: 'JAMESPERSE 여성 의류 바지 플레어 팬츠 no.2555 상품 by.SP',
    discountPrice: 0,
    discountRate: 0,
    freeShipping: true,
    productImage: {
      height: 275,
      name: 'nike_air_max_97_safety_orange.jpeg',
      url:
        'https://d3ikprf0m31yc7.cloudfront.net/images/products/thumb/a5e85e5d916e4e1e9d78d0a5e75a7411',
      width: 183,
    },
    options: [
      { type: 'rgb', attributes: ['#36B401'] },
      { type: 'rgb', attributes: ['#36B401'] },
      { type: 'rgb', attributes: ['#36B401'] },
    ],
    productId: 2742,
    productName: 'no.2555 상품 by.SP',
    productSeason: '19SS',
    searchField:
      ' no.2555 상품 by.SP JAMESPERSE 여성 의류 바지 플레어 팬츠 no.2555 상품 by.SP 여성 의류 바지 플레어 팬츠',
    sellPrice: 256400,
    sellerId: 20,
    sellerName: '박영일',
    setDiscount: false,
  },
}) {
  return (
    <div className={css.wrap}>
      <div className={css.imageWrap}>
        <img src={item.productImage.url} alt={item.productImage.name} />
      </div>
      <div className={css.contentWrap}>
        <div className={css.brandWrap}>
          <div className={css.brandName}>{item.brandName}</div>
          <div className={css.productSeason}>{item.productSeason}</div>
        </div>
        <div className={css.dealName}>{item.dealName}</div>
        <div className={css.priceWrap}>
          <span className={css.sellPrice}>
            {item.sellPrice.toLocaleString()}
          </span>
          <span className={css.discountPrice}>
            {item.discountPrice !== 0
              ? item.discountPrice.toLocaleString()
              : null}
          </span>
          <span className={css.discountRate}>
            {item.discountRate !== 0 ? `${item.discountRate}%` : null}
          </span>
        </div>
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
