import css from './DealItem.module.scss';
import PropTypes from 'prop-types';
import cn from 'classnames';
import LazyLoad from 'react-lazyload';

const DealItem = ({
  deal,
  thumbnail = 0,
  displaySeller = false,
  displayTags = true,
  isLazy = true,
}) => (
  <div
    className={cn(
      css['deal-item'],
      thumbnail === -1 && css['deal-item--horizontal'],
      thumbnail === 1 && css['deal-item--double'],
      thumbnail === 2 && css['deal-item--hex']
    )}
  >
    <div
      className={cn(
        css['deal-item__image'],
        deal.soldOut && css['image--soldout']
      )}
    >
      {isLazy ? (
        <LazyLoad>
          <img
            src={`${deal.productImage.url}?w=375`}
            alt={deal.productImage.name}
          />
        </LazyLoad>
      ) : (
        <img
          src={`${deal.productImage.url}?w=375`}
          alt={deal.productImage.name}
        />
      )}
    </div>
    <div className={css['deal-item__description']}>
      <div className={css['description__brand']}>{deal.brandName}</div>
      <div className={css['description__name']}>{deal.dealName}</div>
      <div className={css['description__price']}>
        {deal.setDiscount || deal.discountPrice ? (
          <>
            <div className={css['price--discount-price']}>
              {deal.discountPrice.toLocaleString()}
            </div>
            <div className={css['price--sell-price']}>
              {deal.sellPrice.toLocaleString()}
            </div>
            <div className={css['price--discount-rate']}>
              {`${Math.round(deal.discountRate)}%`}
            </div>
          </>
        ) : (
          <div className={css['price--discount-price']}>
            {deal.sellPrice.toLocaleString()}
          </div>
        )}
      </div>
      {thumbnail > -1 && displaySeller && (
        <div className={css['description__seller']}>{deal.sellerName}</div>
      )}
      {thumbnail > -1 && thumbnail !== 2 && displayTags && (
        <div className={css['description__tags']}>
          {deal.internationalShipping ? (
            <span className={css['tag']}>해외배송</span>
          ) : (
            <span className={css['tag']}>국내배송</span>
          )}
          {deal.freeShipping && <span className={css['tag']}>무료배송</span>}
          {!deal.brandNew && <span className={css['tag']}>빈티지</span>}
        </div>
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
  internationalShipping: PropTypes.bool,
  freeShipping: PropTypes.bool,
  brandNew: PropTypes.bool,
});

DealItem.propTypes = {
  deal: dealShape.isRequired,
  thumbnail: PropTypes.number,
  displaySeller: PropTypes.bool,
  displayTags: PropTypes.bool,
  isLazy: PropTypes.bool,
};

export default DealItem;
