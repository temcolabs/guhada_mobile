import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './CartItem.module.scss';
import OptionChange from 'components/shoppingcart/OptionChange';
@inject('shoppingcart')
@observer
class CartItem extends Component {
  render() {
    let { data, shoppingcart, index } = this.props;
    return data.cartValidStatus.status ? (
      <Fragment>
        <div className={css.wrap}>
          <div className={css.inner}>
            <div className={css.top}>
              <div className={css.item__check}>
                <input
                  type="checkbox"
                  checked={shoppingcart.selectedCheck[index]}
                  onChange={() => {
                    shoppingcart.changeItemCheckbox(index);
                  }}
                />
              </div>
              <div
                className={css.item__delete}
                onClick={() => {
                  shoppingcart.ShoppingCartItemDelete(data.cartItemId);
                }}
              >
                <img src="/static/icon/m_delete.png" alt="삭제버튼" />
              </div>
            </div>
            <div className={css.cart__item}>
              <div
                className={css.cart__item__image}
                style={{
                  backgroundImage: `url(${data.imageUrl})`,
                }}
              />
              <div className={css.cart__item__info}>
                <div className={css.brand__name}>{data.brandName}</div>
                <div className={css.product__name}>{`${data.season} ${
                  data.dealName
                }`}</div>
                <div className={css.item__price__wrap}>
                  <div className={css.discount__price}>
                    {`${data.discountPrice.toLocaleString()}원`}
                  </div>
                  {data.discountPrice === data.sellPrice ? null : (
                    <div className={css.sell__price}>
                      {`${data.sellPrice.toLocaleString()}원`}
                    </div>
                  )}

                  {data.discountPrice === data.sellPrice ? null : (
                    <div className={css.discount__rate}>
                      {`${parseInt(
                        (100 * (data.sellPrice - data.discountPrice)) /
                          data.sellPrice
                      )}%`}
                    </div>
                  )}
                </div>

                <div
                  className={css.purchase__button}
                  onClick={() => {
                    shoppingcart.shoppingCartimmediatePurchase(data.cartItemId);
                  }}
                >
                  바로 구매
                </div>
              </div>
            </div>
          </div>
          <div className={css.cart__item__option__wrap}>
            <div className={css.cart__item__option}>
              <div className={css.option__title}>구매옵션</div>
              <div className={css.option__property}>
                {shoppingcart.cartListOptions[index]}
              </div>
            </div>
            <div
              className={css.cart__item__option__change__button}
              onClick={() => {
                shoppingcart.optionChangeModal(
                  data.dealId,
                  data.currentQuantity,
                  data.cartItemId,
                  data.selectedCartOption.dealOptionSelectId
                );
              }}
            >
              변경
              <span
                style={
                  shoppingcart.status.optionChangeModal === data.dealId
                    ? { transform: 'rotateX(180deg)' }
                    : { transform: 'rotateX(0deg)' }
                }
              >
                <img src="/static/icon/m_cart_arrow.png" alt="탭 화살표" />
              </span>
            </div>
          </div>
        </div>
        {shoppingcart.status.optionChangeModal === data.dealId ? (
          <OptionChange data={data} />
        ) : null}
      </Fragment>
    ) : (
      <div className={css.wrap}>
        <div className={css.inner__item} style={{ opacity: '0.3' }}>
          <div className={css.top}>
            <div className={css.item__check}>
              <input type="checkbox" checked={false} readOnly />
            </div>
            <div
              className={css.item__delete}
              onClick={() => {
                shoppingcart.ShoppingCartItemDelete(data.cartItemId);
              }}
            >
              <img src="/static/icon/m_delete.png" alt="삭제버튼" />
            </div>
          </div>
          <div className={css.cart__item}>
            <div
              className={css.cart__item__iamge}
              style={{
                backgroundImage: `url(${data.imageUrl})`,
              }}
            />
            <div className={css.cart__item__info}>
              <div className={css.brand__name}>{data.brandName}</div>
              <div className={css.product__name}>{`${data.season} ${
                data.dealName
              }`}</div>
              <div className={css.item__price__wrap}>
                <div className={css.discount__price}>
                  {`${data.discountPrice.toLocaleString()}원`}
                </div>
                <div className={css.sell__price}>
                  {`${data.sellPrice.toLocaleString()}원`}
                </div>
                <div className={css.discount__rate}>
                  {`${parseInt(
                    (100 * (data.sellPrice - data.discountPrice)) /
                      data.sellPrice
                  )}%`}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={css.nosale}>
          {data.cartValidStatus.cartErrorMessage}
        </div>
      </div>
    );
  }
}

export default CartItem;
