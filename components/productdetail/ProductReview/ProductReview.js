import React, { Component } from 'react';
import SectionWrap from '../SectionWrap';
import css from './ProductReview.module.scss';
import StarItem from '../StarItem';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import ReviewHeader from './ReviewHeader';

@inject('productreview')
@observer
class ProductReview extends Component {
  render() {
    let { productreview } = this.props;
    let review = productreview.review;
    let reviewSummary = productreview.reviewSummary;

    console.log('toJS(reviewSummary)', toJS(reviewSummary));
    return (
      <SectionWrap>
        <ReviewHeader reviewSummary={reviewSummary} />
      </SectionWrap>
    );
  }
}

export default ProductReview;
