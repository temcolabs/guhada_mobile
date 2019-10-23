import React from 'react';
import css from './RelatedAndRecommend.module.scss';
import cn from 'classnames';
import { pushRoute } from 'lib/router';

export default function RelatedAndRecommend({
  dealsOfSameBrand = [
    {
      brandId: '',
      brandName: '',
      dealId: '',
      dealName: '',
      discountPrice: '',
      discountRate: '',
      imageName: '',
      imageUrl: '',
      options: '',
      productId: '',
      productImage: [
        {
          height: '',
          name: '',
          url: '',
          width: '',
        },
      ],
      productName: '',
      productSeason: '',
      sellPrice: '',
      sellerId: '',
      sellerName: '',
      shipExpenseType: '',
      totalStock: '',
    },
  ],
  dealsOfRecommend = [
    {
      brandId: '',
      brandName: '',
      dealId: '',
      dealName: '',
      discountPrice: '',
      discountRate: '',
      imageName: '',
      imageUrl: '',
      options: '',
      productId: '',
      productImage: [
        {
          height: '',
          name: '',
          url: '',
          width: '',
        },
      ],
      productName: '',
      productSeason: '',
      sellPrice: '',
      sellerId: '',
      sellerName: '',
      shipExpenseType: '',
      totalStock: '',
    },
  ],
}) {
  return (
    <div className={css.wrap}>
      {dealsOfSameBrand.length > 0 && (
        <>
          <div className={css.header}>판매자의 연관상품</div>
          <div className={css.slideWrap}>
            {dealsOfSameBrand.map(deal => {
              return (
                <div
                  className={css.itemWrap}
                  key={deal.dealId}
                  onClick={() =>
                    pushRoute(`/productdetail?deals=${deal.dealId}`)
                  }
                >
                  <img
                    className={css.image}
                    src={deal.productImage.url || ''}
                    alt={deal.productImage.name}
                  />
                  <div className={css.contentsWrap}>
                    <div className={css.brandWrap}>
                      <div className={css.brand}>{deal.brandName}</div>
                      <div className={css.season}>{deal.productSeason}</div>
                    </div>
                    <div className={css.title}>{deal.dealName}</div>
                    <div className={css.price}>
                      {deal.sellPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {dealsOfRecommend.length > 0 && (
        <>
          <div className={cn(css.header)}>추천상품</div>
          <div className={css.slideWrap}>
            {dealsOfRecommend.map(deal => {
              return (
                <div
                  className={css.itemWrap}
                  key={deal.dealId}
                  onClick={() =>
                    pushRoute(`/productdetail?deals=${deal.dealId}`)
                  }
                >
                  <img
                    className={css.image}
                    src={deal.productImage.url || ''}
                    alt={deal.productImage.name}
                  />
                  <div className={css.contentsWrap}>
                    <div className={css.brandWrap}>
                      <div className={css.brand}>{deal.brandName}</div>
                      <div className={css.season}>{deal.productSeason}</div>
                    </div>
                    <div className={css.title}>{deal.dealName}</div>
                    <div className={css.price}>
                      {deal.sellPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
