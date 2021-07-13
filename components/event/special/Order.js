import { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './Order.module.scss';
import cn from 'classnames';

class Order extends Component {
  render() {
    const { isVisible, onClose, getOrderDeal, sellerStoreFilter } = this.props;
    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap}>
          <button
            className={css.close}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />
          <div className={css.header}>상품정렬</div>
          <div className={css.itemWrap}>
            <div
              className={cn(css.item, {
                [css.selected]: sellerStoreFilter === 'DATE',
              })}
              onClick={(e) => {
                getOrderDeal('DATE', e);
              }}
            >
              신상품 순
            </div>
            <div
              className={cn(css.item, {
                [css.selected]: sellerStoreFilter === 'SCORE',
              })}
              onClick={(e) => {
                getOrderDeal('SCORE', e);
              }}
            >
              평점 순
            </div>
            <div
              className={cn(css.item, {
                [css.selected]: sellerStoreFilter === 'PRICE_ASC',
              })}
              onClick={(e) => {
                getOrderDeal('PRICE_ASC', e);
              }}
            >
              낮은 가격 순
            </div>
            <div
              className={cn(css.item, {
                [css.selected]: sellerStoreFilter === 'PRICE_DESC',
              })}
              onClick={(e) => {
                getOrderDeal('PRICE_DESC', e);
              }}
            >
              높은 가격 순
            </div>
          </div>
        </div>
      </SlideIn>
    );
  }
}

export default Order;
