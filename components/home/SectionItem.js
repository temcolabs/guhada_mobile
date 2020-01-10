import React from 'react';
import css from './SectionItem.module.scss';
import cn from 'classnames';
import isTruthy from 'childs/lib/common/isTruthy';
import _ from 'lodash';
import brandNew from 'childs/lib/constant/filter/brandNew';
import internationalShipping from 'childs/lib/constant/filter/internationalShipping';

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
    productImage: [
      {
        height: 275,
        name: 'nike_air_max_97_safety_orange.jpeg',
        url:
          'https://d3ikprf0m31yc7.cloudfront.net/images/products/thumb/a5e85e5d916e4e1e9d78d0a5e75a7411',
        width: 183,
      },
    ],
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
  sellerStore = false,
  likeItemDelete = () => {},
}) {
  return (
    <div className={css.wrap}>
      <div className={css.imageWrap}>
        {item.freeShipping === true || item.freeShipping === 'FREE' ? (
          <div className={css.freeShipping}>
            무료
            <br />
            배송
          </div>
        ) : null}
        <img src={item.productImage.url} alt={item.productImage.name} />
        {isTruthy(likeItemDelete) && (
          <div
            className={css.item__delete__btn}
            onClick={e => {
              e.preventDefault();
              likeItemDelete(e, item.productId);
            }}
          />
        )}
      </div>
      <div className={css.contentWrap}>
        {_.isEmpty(item.brandNew) && (
          <div className={css.conditionWrap}>
            <div className={cn(css.brandNew, { [css.new]: item.brandNew })}>
              {item.brandNew ? '' : brandNew.USED}
            </div>

            {item.internationalShipping && (
              <>
                {!item.brandNew && <div className={css.betweenLine} />}
                <div className={css.internationalShipping}>
                  {item.internationalShipping &&
                    internationalShipping.INTERNATIONAL}
                </div>
              </>
            )}
          </div>
        )}
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
        {sellerStore === false && (
          <div className={css.sellerWrap}>
            {/* <div className={css.sellerLevel}>
            <div className={css.level}>{1}</div>
          </div> */}
            <span className={css.sellerName}>{item.sellerName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
