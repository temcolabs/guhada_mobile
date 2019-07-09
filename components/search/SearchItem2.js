import React, { Component } from 'react';
import css from './SearchItem2.module.scss';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { LinkRoute } from 'lib/router';

@observer
class SearchItem2 extends Component {
  static propTypes = {
    brandId: PropTypes.number,
    brandName: PropTypes.string,
    categoryId: PropTypes.number,
    dealId: PropTypes.number,
    dealName: PropTypes.string,
    discountPrice: PropTypes.number,
    discountRate: PropTypes.number,
    freeShipping: PropTypes.bool,
    productImage: {
      width: PropTypes.number,
      height: PropTypes.number,
      name: PropTypes.string,
      url: PropTypes.string,
    },
    options: [],
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
            <LinkRoute
              href={`/product/productdetail?deals=${deal.dealId}`}
              key={index}
            >
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
                  <div className={css.brandWrap}>
                    <span className={css.brandName}>{deal.brandName}</span>
                    <span className={css.productSeason}>
                      {deal.productSeason}
                    </span>
                  </div>
                  <div className={css.productName}>{deal.productName}</div>

                  {deal.options
                    ? deal.options.map(option => {
                        if (option.type === 'text') {
                          return (
                            <div className={css.textOption}>
                              {option.attributes.map((size, sizeIndex) => {
                                return (
                                  <div className={css.sizeItem} key={sizeIndex}>
                                    {size}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return null;
                      })
                    : null}

                  <div className={css.priceWrap}>
                    <div className={css.discountWrap}>
                      <span className={css.sellPrice}>
                        {deal.sellPrice.toLocaleString() + '원'}
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

export default SearchItem2;
