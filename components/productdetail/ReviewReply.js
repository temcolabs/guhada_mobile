import React from 'react';
import css from './ReviewReply.module.scss';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';

const ReviewReply = ({ reviewItem = {} }) => {
  return reviewItem.review.reply ? (
    <div className={css.seller__replied__wrap}>
      <div className={css.seller__name}>{`${
        reviewItem.review.sellerNickname
      }`}</div>
      <div className={css.seller__reply}>{`${reviewItem.review.reply}`}</div>
      <div className={css.seller__create}>
        {moment(reviewItem.review.replyAt).format(dateFormat.YYYYMMDD_UI)}
        {` `}
        {moment(reviewItem.review.replyAt).format(dateFormat.HHMM)}
      </div>
    </div>
  ) : null;
};

export default ReviewReply;
