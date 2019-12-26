import React, { Fragment } from 'react';
import css from './MypageLikeItem.module.scss';
import { inject, observer } from 'mobx-react';
import { LinkRoute } from 'childs/lib/router';

@inject('mypageLike')
@observer
class MypageLikeItem extends React.Component {
  render() {
    let { mypageLike, data } = this.props;
    return (
      <div className={css.wrap}>
        <div
          className={css.item__back__image}
          style={{
            backgroundImage: `url(${data.imageUrl})`,
          }}
          onClick={() => {
            mypageLike.goProduct(data.dealId);
          }}
        >
          {data.totalStock > 0 ? (
            <div className={css.select__button}>
              <div
                onClick={e => {
                  mypageLike.modalShoppingCart(e, data.dealId, 'shoppingcart');
                }}
              >
                장바구니
              </div>
              <div
                onClick={e => {
                  data.options.length > 0
                    ? mypageLike.modalShoppingCart(e, data.dealId, 'purchase')
                    : mypageLike.modalImmediatePurchase(e, data.dealId);
                }}
              >
                바로구매
              </div>
            </div>
          ) : (
            <div
              className={[css.select__button, css.soldOut].join(' ')}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <div>품절</div>
            </div>
          )}
          <div
            className={css.item__delete__btn}
            onClick={e => {
              mypageLike.likeItemDelete(e, data.productId);
            }}
          />
        </div>
        <div className={css.item__detail}>
          <LinkRoute href={`/productdetail?deals=${data.dealId}`}>
            <a>
              <div className={css.item__detail__top}>
                <div className={css.item__detail__brand}>{data.brandName}</div>
                <div className={css.item__detail__season}>
                  {data.productSeason ? data.productSeason : ''}
                </div>
              </div>
              <div className={css.item__name}>{data.dealName}</div>
              <div className={css.item__price}>
                <div className={css.item__discount__price}>
                  {data?.discountPrice?.toLocaleString()}
                </div>
                {data.discountPrice === data.sellPrice ? null : (
                  <Fragment>
                    <div className={css.item__sell__price}>
                      {data?.sellPrice?.toLocaleString()}
                    </div>
                    <div className={css.item__discount__rate}>
                      {`${data.discountRate ? data.discountRate : 0}%`}
                    </div>
                  </Fragment>
                )}
              </div>
            </a>
          </LinkRoute>
          <div className={css.seller}>
            {/* <div className={css.seller__level}>
              <div>1</div>
            </div> */}
            <div className={css.seller__name}>
              {data.sellerName ? data.sellerName : ''}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MypageLikeItem;
