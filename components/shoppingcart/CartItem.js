import { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import css from './CartItem.module.scss';
import OptionChange from 'components/shoppingcart/OptionChange';
import Link from 'next/link';
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
              <div className={css.topLeft}>
                <div className={css.item__check}>
                  <label>
                    <input
                      type="checkbox"
                      checked={shoppingcart.selectedCheck[index]}
                      onChange={() => {
                        shoppingcart.changeItemCheckbox(index);
                      }}
                    />
                    <div />
                  </label>
                </div>
              </div>
              <div
                className={css.item__delete}
                onClick={() => {
                  shoppingcart.ShoppingCartItemDelete(data.cartItemId);
                }}
              />
            </div>
            <div className={css.cart__item}>
              <Link href={`/productdetail?deals=${data.dealId}`}>
                <div
                  className={css.cart__item__image}
                  style={{
                    backgroundImage: `url(${data.imageUrl})`,
                  }}
                />
              </Link>
              <Link href={`/productdetail?deals=${data.dealId}`}>
                <div className={css.cart__item__info}>
                  <div className={css.brand__name}>{data.brandName}</div>
                  <div className={css.product__name}>{`${
                    data.season ? data.season : ''
                  } ${data.dealName}`}</div>
                  <div className={css.item__price__wrap}>
                    <div className={css.discount__price}>
                      {`${data?.discountPrice?.toLocaleString()}원`}
                    </div>
                    {data.discountPrice === data.sellPrice ? null : (
                      <div className={css.sell__price}>
                        {`${data?.sellPrice?.toLocaleString()}원`}
                      </div>
                    )}

                    {data.discountRate > 0 ? (
                      <div className={css.discount__rate}>
                        {`${data?.discountRate}%`}
                      </div>
                    ) : null}
                  </div>
                  <div
                    className={css.purchase__button}
                    onClick={(e) => {
                      shoppingcart.shoppingCartimmediatePurchase(
                        e,
                        data.cartItemId
                      );
                    }}
                  >
                    바로 구매
                  </div>
                </div>
              </Link>
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
                  data.selectedCartOption
                );
              }}
            >
              변경
              <span
                style={
                  shoppingcart.status.optionChangeModal === data.cartItemId
                    ? { transform: 'rotateX(180deg)' }
                    : { transform: 'rotateX(0deg)' }
                }
              >
                <img src="/public/icon/m_cart_arrow.png" alt="탭 화살표" />
              </span>
            </div>
          </div>
        </div>
        {shoppingcart.status.optionChangeModal === data.cartItemId ? (
          <OptionChange data={data} />
        ) : null}
      </Fragment>
    ) : (
      <div className={css.wrap}>
        <div className={css.inner}>
          <div className={css.top}>
            <div className={css.topLeft}>
              <label>
                <input type="checkbox" checked={false} readOnly />
                <div />
              </label>
              {data.cartValidStatus.cartErrorMessage.match(/종료|중지|품절/) ? (
                <div className={css.soldoutMessage}>
                  <i />
                  {data.cartValidStatus.cartErrorMessage}
                </div>
              ) : (
                <div className={css.noSaleMessage}>
                  <i />
                  {data.cartValidStatus.cartErrorMessage}
                </div>
              )}
            </div>
            <div
              className={css.item__delete}
              onClick={() => {
                shoppingcart.ShoppingCartItemDelete(data.cartItemId);
              }}
            />
          </div>
          <div className={css.cart__item}>
            <Link href={`/productdetail?deals=${data.dealId}`}>
              <div
                className={css.cart__item__image}
                style={{
                  backgroundImage: `url(${data.imageUrl})`,
                }}
              />
            </Link>
            <Link href={`/productdetail?deals=${data.dealId}`}>
              <div className={css.cart__item__info}>
                <div className={[css.brand__name, css.noSale].join(' ')}>
                  {data.brandName}
                </div>
                <div className={[css.product__name, css.noSale].join(' ')}>{`${
                  data.season ? data.season : ''
                } ${data.dealName}`}</div>
                <div className={[css.item__price__wrap, css.noSale].join(' ')}>
                  <div className={css.discount__price}>
                    {`${data?.discountPrice?.toLocaleString()}원`}
                  </div>
                  {data.discountPrice === data.sellPrice ? null : (
                    <div className={css.sell__price}>
                      {`${data?.sellPrice?.toLocaleString()}원`}
                    </div>
                  )}

                  {data.discountRate > 0 ? (
                    <div className={css.discount__rate}>
                      {`${data?.discountRate}%`}
                    </div>
                  ) : null}
                </div>

                <div className={css.goProduct}>상품 보기</div>
              </div>
            </Link>
          </div>
        </div>
        <div className={[css.cart__item__option__wrap, css.noSale].join(' ')}>
          <div className={css.cart__item__option}>
            <div className={css.option__title}>구매옵션</div>
            <div className={css.option__property}>
              {shoppingcart.cartListOptions[index]}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CartItem;
