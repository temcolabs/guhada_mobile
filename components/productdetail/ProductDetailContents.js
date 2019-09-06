import React, { Component } from 'react';
import css from './ProductDetailContents.module.scss';
class ProductDetailContents extends Component {
  render() {
    const { tabRefMap, deals } = this.props;
    return (
      <div
        className={css.wrap}
        ref={tabRefMap.detailTab}
        dangerouslySetInnerHTML={{ __html: deals.desc }}
      />
    );
  }
}

export default ProductDetailContents;
