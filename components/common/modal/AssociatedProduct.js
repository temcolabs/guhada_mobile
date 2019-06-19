import React, { Component } from 'react';
import css from './AssociatedProduct.module.scss';
import { setScrollability } from 'lib/scroll';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
@inject('productoption')
@observer
export default class AssociatedProduct extends Component {
  componentDidMount() {
    setScrollability({ isLockScroll: true }); // 스크롤 방지
  }
  componentWillUnmount() {
    setScrollability({ isLockScroll: false }); // 스크롤 방지
    this.props.productoption.shoppingCartSuccessModalClose();
  }
  render() {
    let { productoption } = this.props;
    return (
      <div className={css.modalWrap}>
        <div className={css.modal}>
          <div
            className={css.modalClose}
            onClick={() => {
              productoption.shoppingCartSuccessModalClose();
            }}
          >
            <img
              src="/static/icon/modal_close.png"
              alt="장바구니 모달창 닫기"
            />
          </div>
          <div className={css.wrapTitle}>상품이 장바구니에 추가되었습니다.</div>
          <div className={css.associatedProduct}>
            <div className={css.associatedProductTitle}>
              이 상품과 함께 많이 구매한 상품
            </div>
            <ul>
              {productoption.associatedProduct
                .slice(0, 3)
                .map((data, index) => {
                  return (
                    <Link
                      href={`/productdetail?deals=${data.dealId}`}
                      key={index}
                    >
                      <li className={css.associatedItem}>
                        <div className={css.associatedItemImage}>
                          <img src={data.imageUrl} alt="연관상품" />
                        </div>
                        <div className={css.brandName}>
                          <span>{data.brandName}</span>
                          <span>{data.productSeason}</span>
                        </div>
                        <div className={css.productName}>
                          {data.productName}
                        </div>
                      </li>
                    </Link>
                  );
                })}
            </ul>
          </div>
          <div className={css.btnGroup}>
            <Link href={'/shoppingcart'}>
              <div>장바구니로 이동</div>
            </Link>
            <div
              onClick={() => {
                productoption.shoppingCartSuccessModalClose();
              }}
            >
              쇼핑 계속하기
            </div>
          </div>
        </div>
      </div>
    );
  }
}
