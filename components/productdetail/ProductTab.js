import React, { Component } from 'react';
import cn from 'classnames';
import css from './ProductTab.module.scss';
class ProductTab extends Component {
  render() {
    return (
      <div className={css.wrap}>
        <div className={cn(css.item)}>상세정보</div>
        <div className={cn(css.item, css.selected)}>상품문의</div>
        <div className={cn(css.item)}>셀러스토어</div>
      </div>
    );
  }
}

export default ProductTab;
