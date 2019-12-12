import React, { Component } from 'react';
import css from './ReviewWriteModal.module.scss';

export class ReviewWriteModalScore extends Component {
  render() {
    const items = [0, 1, 2];

    return (
      <div className={css.scoreWrap}>
        <div className={css.scoreHeader}>{this.props.header}</div>
        <div>
          {items.map((item, index) => {
            return (
              <div key={index} className={css.scoreItem}>
                <div
                  className={
                    this.props.score === this.props.items[item]
                      ? css.scoreBtnFocus
                      : css.scoreBtn
                  }
                  onClick={() =>
                    this.props.onChangeScore(this.props.items[item])
                  }
                />
                <div>{this.props.itemsText[item]}</div>
              </div>
            );
          })}

          <div className={css.scoreLine} />
        </div>
      </div>
    );
  }
}

export default ReviewWriteModalScore;
