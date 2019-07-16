import React, { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './NormalSlide.module.scss';
import cn from 'classnames';

class ReviewRating extends Component {
  render() {
    const { isVisible, onClose } = this.props;
    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>리뷰평점</div>
          <div className={css.itemWrap}>
            <div className={cn(css.item, {})}>전체 평점</div>
            <div className={cn(css.item, {})}>5점 만</div>
            <div className={cn(css.item, {})}>4점 만</div>
            <div className={cn(css.item, {})}>3점 만</div>
            <div className={cn(css.item, {})}>2점 만</div>
            <div className={cn(css.item, {})}>1점 만</div>
          </div>
        </div>
      </SlideIn>
    );
  }
}

export default ReviewRating;
