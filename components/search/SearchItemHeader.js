import React, { Component } from 'react';
import css from './SearchItemHeader.module.scss';
import { inject, observer } from 'mobx-react';
import cn from 'classnames';

@inject('searchitem')
@observer
class SearchItemHeader extends Component {
  render() {
    const { searchitem } = this.props;
    return (
      <div className={css.wrap}>
        <div className={css.order}>신상품순</div>
        <div className={css.thumbnail}>
          <div
            className={cn(css.list4, {
              [css.selected]: searchitem.thumbnail === 'list4',
            })}
            onClick={() => searchitem.setThumbnailStyle('list4')}
          ></div>
          <div
            className={cn(css.list2, {
              [css.selected]: searchitem.thumbnail === 'list2',
            })}
            onClick={() => searchitem.setThumbnailStyle('list2')}
          ></div>
          <div
            className={cn(css.list6, {
              [css.selected]: searchitem.thumbnail === 'list6',
            })}
            onClick={() => searchitem.setThumbnailStyle('list6')}
          ></div>
        </div>
        <div className={css.detail}>상세검색</div>
      </div>
    );
  }
}

export default SearchItemHeader;
