import React, { Component } from 'react';
import css from './SearchItem4.module.scss';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { LinkRoute } from 'lib/router';

@observer
class SearchItem4 extends Component {
  static propTypes = {
    brandId: PropTypes.number,
    brandName: PropTypes.string,
    categoryId: PropTypes.number,
    dealId: PropTypes.number,
    dealName: PropTypes.string,
    discountPrice: PropTypes.number,
    discountRate: PropTypes.number,
    freeShipping: PropTypes.bool,
    productImage: PropTypes.object,
    options: PropTypes.object,
    productId: PropTypes.number,
    productName: PropTypes.string,
    productSeason: PropTypes.string,
    searchField: PropTypes.string,
    sellPrice: PropTypes.number,
    sellerId: PropTypes.number,
    sellerName: PropTypes.string,
    setDiscount: PropTypes.bool,
  };
  render() {
    let { deals } = this.props;

    return (
      <>
        {deals.map((deal, index) => {
          return (
            <LinkRoute href={`/productdetail?deals=${deal.dealId}`} key={index}>
              <div className={css.wrap}>
                <div className={css.imageWrap}>
                  <div className={css.color}>
                    {deal.options
                      ? deal.options.map(option => {
                          if (option.type === 'rgb') {
                            return option.attributes.map(
                              (color, colorIndex) => {
                                return (
                                  <div
                                    className={css.box}
                                    style={{
                                      backgroundColor: color,
                                    }}
                                    key={colorIndex}
                                  />
                                );
                              }
                            );
                          }
                          return null;
                        })
                      : null}
                  </div>
                  <img
                    className={css.imageUrl}
                    src={deal.productImage.url}
                    width={165}
                    height={206}
                    alt={deal.productImage.name}
                  />
                </div>
                <div className={css.detailWrap}>
                  <div className={css.brandName}>
                    {deal.brandName}
                    <span className={css.productSeason}>
                      {deal.productSeason}
                    </span>
                  </div>
                  <div className={css.productName}>{deal.productName}</div>
                  {deal.discountRate > 0 ? (
                    <div className={css.priceWrap}>
                      <div className={css.discountWrap}>
                        <span className={css.sellPrice}>
                          {deal.discountPrice.toLocaleString()}
                        </span>
                        <span className={css.discountPrice}>
                          {deal.discountRate !== 0
                            ? deal.sellPrice.toLocaleString()
                            : null}
                        </span>
                      </div>
                      <span className={css.discountRate}>
                        {deal.discountRate !== 0
                          ? `${deal.discountRate}%`
                          : null}
                      </span>
                    </div>
                  ) : (
                    <div className={css.priceWrap}>
                      <span className={css.sellPrice}>
                        {`${deal.sellPrice.toLocaleString()}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </LinkRoute>
          );
        })}
      </>
    );
  }
}

export default SearchItem4;
