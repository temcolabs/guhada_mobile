import React, { Component } from 'react';
import css from './ReviewWriteModal.module.scss';
import cn from 'classnames';

export class ReviewWriteModalScore extends Component {
  render() {
    const items = [0, 1, 2];

    return (
      <div className={css.scoreWrap}>
        <div className={css.scoreHeader}>{this.props.header}</div>
        <div className={css.scoreItemWrap}>
          {items.map((item, index) => {
            return (
              <div
                key={index}
                className={cn(css.scoreItem, {
                  [css.isFocused]: this.props.score === this.props.items[item],
                })}
              >
                <div
                  className={css.scoreBtn}
                  onClick={() =>
                    this.props.onChangeScore(this.props.items[item])
                  }
                />
                <div>{this.props.itemsText[item]}</div>
              </div>
            );
          })}
        </div>
        <div className={css.scoreLine} />
      </div>
    );
  }
}

export default ReviewWriteModalScore;
