import React, { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './NormalSlide.module.scss';
import cn from 'classnames';

class ReviewOrder extends Component {
  changeOrder = item => {
    const { onClose, setOrder, setOrderLabel } = this.props;

    setOrder(item.sort, item.dir);
    onClose();
    setOrderLabel(item.label);
  };

  render() {
    const orderList = [
      { label: '최신 순', dir: 'desc', sort: 'created_at' },
      { label: '랭킹 순', dir: 'desc', sort: 'created_at' },
      { label: '평점 높은 순', dir: 'desc', sort: 'product_rating' },
      { label: '평점 낮은 순', dir: 'asc', sort: 'product_rating' },
    ];

    const { isVisible, onClose } = this.props;
    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>리뷰순서</div>
          <div className={css.itemWrap}>
            {orderList.map((item, index) => {
              return (
                <div
                  className={cn(css.item, {})}
                  onClick={() => {
                    this.changeOrder(item);
                  }}
                  key={index}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </SlideIn>
    );
  }
}

export default ReviewOrder;
