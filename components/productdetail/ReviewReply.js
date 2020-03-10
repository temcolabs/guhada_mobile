import React from 'react';
import css from './ReviewReply.module.scss';
import moment from 'moment';
import { dateFormat } from 'childs/lib/constant';

const ReviewReply = ({ reviewItem = {}, wrapStyle = {} }) => {
  return reviewItem.review.reply ? (
    <div
      className={css.seller__replied__wrap}
      style={{
        background: '#f9f9fa',
        padding: '20px 16px',
        ...wrapStyle,
      }}
    >
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
