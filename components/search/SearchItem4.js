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
    imageName: PropTypes.string,
    imageUrl: PropTypes.string,
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
                    src={deal.imageUrl}
                    width={165}
                    height={206}
                    alt={deal.imageName.split('.')[0]}
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
                  <div className={css.priceWrap}>
                    <div className={css.discountWrap}>
                      <span className={css.sellPrice}>
                        {deal.sellPrice.toLocaleString()}
                      </span>
                      <span className={css.discountPrice}>
                        {deal.discountPrice != 0
                          ? deal.discountPrice.toLocaleString()
                          : '100000'}
                      </span>
                    </div>
                    <span className={css.discountRate}>
                      {deal.discountRate !== 0 ? `${deal.discountRate}%` : '5%'}
                    </span>
                  </div>
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
