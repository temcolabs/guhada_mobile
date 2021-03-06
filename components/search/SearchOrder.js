import React, { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './SearchOrder.module.scss';
import cn from 'classnames';
import Router from 'next/router';
/**
 * 검색 결과에서 오더 표시하는 Slide
 */
class SearchOrder extends Component {
  render() {
    const {
      isVisible,
      onClose,
      setSearchOrderFilter,
      searchOrderFilter,
      toSearch,
    } = this.props;

    const { query } = Router.router;

    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>상품정렬</div>
          <div className={css.itemWrap}>
            <div
              className={cn(css.item, {
                [css.selected]: searchOrderFilter === 'DATE',
              })}
              onClick={() => {
                setSearchOrderFilter('DATE');
                toSearch(Object.assign({}, query, { order: 'DATE' }));
                onClose();
              }}
            >
              신상품 순
            </div>
            <div
              className={cn(css.item, {
                [css.selected]: searchOrderFilter === 'SCORE',
              })}
              onClick={() => {
                setSearchOrderFilter('SCORE');
                toSearch(
                  Object.assign({}, query, {
                    order: 'SCORE',
                  })
                );
                onClose();
              }}
            >
              평점 순
            </div>
            <div
              className={cn(css.item, {
                [css.selected]: searchOrderFilter === 'PRICE_ASC',
              })}
              onClick={() => {
                setSearchOrderFilter('PRICE_ASC');
                toSearch(Object.assign({}, query, { order: 'PRICE_ASC' }));
                onClose();
              }}
            >
              낮은 가격 순
            </div>
            <div
              className={cn(css.item, {
                [css.selected]: searchOrderFilter === 'PRICE_DESC',
              })}
              onClick={() => {
                setSearchOrderFilter('PRICE_DESC');
                toSearch(Object.assign({}, query, { order: 'PRICE_DESC' }));
                onClose();
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

export default SearchOrder;
