import { Component } from 'react';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import css from './NormalSlide.module.scss';
import cn from 'classnames';
import { inject, observer } from 'mobx-react';

@inject('productreview')
@observer
class ReviewRating extends Component {
  render() {
    const { isVisible, onClose, productreview, ratingList } = this.props;

    return (
      <SlideIn isVisible={isVisible} direction={slideDirection.BOTTOM}>
        <div className={css.wrap}>
          <button className={css.close} onClick={onClose} />
          <div className={css.header}>리뷰평점</div>
          <div className={css.itemWrap}>
            {ratingList.map((item, index) => {
              return (
                <div
                  className={cn(css.item, {})}
                  onClick={() => {
                    onClose();
                    productreview.setReviewTab('all', item.value);
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

export default ReviewRating;
