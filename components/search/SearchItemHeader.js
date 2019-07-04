import React, { Component } from 'react';
import css from './SearchItemHeader.module.scss';

export class SearchItemHeader extends Component {
  render() {
    return (
      <div className={css.wrap}>
        <div className={css.order}>신상품순</div>
        <div className={css.detail}>상세검색</div>
      </div>
    );
  }
}

export default SearchItemHeader;
