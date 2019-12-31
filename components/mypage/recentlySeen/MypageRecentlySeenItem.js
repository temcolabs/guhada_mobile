import React, { Fragment, Component } from 'react';
import css from './MypageRecentlySeenItem.module.scss';
import { inject, observer } from 'mobx-react';
import { LinkRoute } from 'childs/lib/router';

@inject('mypageRecentlySeen')
@observer
class MypageRecentlySeenItem extends Component {
  render() {
    let { mypageRecentlySeen, data } = this.props;
    return (
      <div className={css.wrap}>
        <div
          className={css.item__back__image}
          style={{
            backgroundImage: `url(${data.imageUrls[0]})`,
          }}
          onClick={() => {
            mypageRecentlySeen.goProduct(data.dealsId);
          }}
        >
          <div
            className={css.item__delete__btn}
            onClick={e => {
              mypageRecentlySeen.removeItem(e, data.dealsId);
            }}
          />
        </div>
        <div className={css.item__detail}>
          <LinkRoute href={`/productdetail?deals=${data.dealsId}`}>
            <div>
              <div className={css.item__detail__top}>
                <div className={css.item__detail__brand}>
                  {data?.brandName ? data.brandName : ''}
                </div>
                <div className={css.item__detail__season}>
                  {data?.season ? data.season : ''}
                </div>
              </div>
              <div className={css.item__name}>
                {data?.name ? data.name : ''}
              </div>
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
                      {`${data.discountRate}%`}
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </LinkRoute>
          <div className={css.seller}>
            {/* <div className={css.seller__level}>
              <div>1</div>
            </div> */}
            <div className={css.seller__name}>{data.sellerName}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default MypageRecentlySeenItem;
