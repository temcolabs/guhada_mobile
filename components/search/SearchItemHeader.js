import React, { Component } from 'react';
import css from './SearchItemHeader.module.scss';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';
import SearchFilterResult from './SearchFilterResult';

@inject('searchitem', 'alert')
@observer
class SearchItemHeader extends Component {
  render() {
    const {
      searchitem,
      setIsOrderVisible,
      isBrand,
      setIsFilterVisible,
      alert,
      scrollDirection,
    } = this.props;

    return (
      <>
        <div
          className={cn(css.wrap, { [css.scrollUp]: scrollDirection === 'up' })}
          style={{ top: `${isBrand === true ? 60 : 104}px` }}
        >
          <div className={css.order} onClick={() => setIsOrderVisible(true)}>
            {searchitem.searchOrderFilter === 'DATE'
              ? '신상품 순'
              : searchitem.searchOrderFilter === 'PRICE_ASC'
              ? '낮은 가격 순'
              : searchitem.searchOrderFilter === 'PRICE_DESC'
              ? '높은 가격 순'
              : searchitem.searchOrderFilter === 'SCORE'
              ? '평점 순'
              : '신상품 순'}
          </div>
          <div className={css.thumbnail}>
            <div
              className={cn(css.list4, {
                [css.selected]: searchitem.thumbnail === 'list4',
              })}
              onClick={() => searchitem.setThumbnailStyle('list4')}
            />
            <div
              className={cn(css.list2, {
                [css.selected]: searchitem.thumbnail === 'list2',
              })}
              onClick={() => searchitem.setThumbnailStyle('list2')}
            />
            <div
              className={cn(css.list6, {
                [css.selected]: searchitem.thumbnail === 'list6',
              })}
              onClick={() => searchitem.setThumbnailStyle('list6')}
            />
          </div>
          <div
            className={css.detail}
            onClick={() =>
              searchitem.deals.length !== 0 && setIsFilterVisible(true)
            }
          >
            상세검색
          </div>
        </div>
        <SearchFilterResult />
      </>
    );
  }
}

export default SearchItemHeader;
