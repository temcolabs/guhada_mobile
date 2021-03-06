import React from 'react';
import css from './DealItem.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Image from 'components/atoms/Image';

const ReviewDealItem = ({ isLazy = true, deal, horizontal = false }) => (
  <div
    className={cn(css['deal-item'], horizontal && css['deal-item--horizontal'])}
  >
    <div
      className={cn(
        css['deal-item__image'],
        deal.soldOut && css['image--soldout']
      )}
    >
      <Image isLazy={false} src={`${deal.productImage.url}`} size={'contain'} />
    </div>
    <div className={css['deal-item__description']}>
      <div className={css['deal-item__brand']}>{deal.brandName}</div>
      <div className={css['deal-item__name']}>{deal.dealName}</div>
      <div className={css['deal-item__price']}>
        <div className={css['price--discount-price']}>
          {deal.sellPrice.toLocaleString()}
        </div>
      </div>
      {!horizontal && (
        <div className={css['deal-item__seller']}>{deal.sellerName}</div>
      )}
    </div>
  </div>
);

export const dealShape = PropTypes.shape({
  brandId: PropTypes.number,
  brandName: PropTypes.string,
  sellerId: PropTypes.number,
  sellerName: PropTypes.string,
  productId: PropTypes.number,
  productName: PropTypes.string,
  productImage: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
  dealId: PropTypes.number,
  dealName: PropTypes.string,
  sellPrice: PropTypes.number,
  setDiscount: PropTypes.bool,
  discountPrice: PropTypes.number,
  discountRate: PropTypes.number,
  soldOut: PropTypes.bool,
});

ReviewDealItem.propTypes = {
  deal: dealShape.isRequired,
  small: PropTypes.bool,
};

export default ReviewDealItem;
