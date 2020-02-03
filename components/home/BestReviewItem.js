import React from 'react';
import css from './BestReviewItem.module.scss';
import StarItem from 'components/mypage/review/StarItem';
import { observer } from 'mobx-react';
import { pushRoute } from 'childs/lib/router';

function BestReviewItem({
  item = {
    id: 0,
    productId: 0,
    dealId: 0,
    dealName: '',
    userId: 0,
    userNickname: '',
    imageUrl: '',
    rating: '',
    text: '',
  },
}) {
  return (
    <div
      className={css.wrap}
      onClick={() => pushRoute(`/productdetail?deals=${item.dealId}`)}
    >
      <div
        className={css.img}
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      />
      <div className={css.detailWrap}>
        <div className={css.title}>{item.dealName}</div>
        <div className={css.desc}>{item.text}</div>
        {StarItem(item.rating)}
      </div>
    </div>
  );
}
export default observer(BestReviewItem);
