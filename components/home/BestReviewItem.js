import { useState } from 'react';
import dynamic from 'next/dynamic';
import LazyLoad from 'react-lazyload';
import css from './BestReviewItem.module.scss';
import StarItem from 'components/mypage/review/StarItem';
import { observer } from 'mobx-react';

const DynamicReviewDeatailModal = dynamic(
  () => import('template/Review/components/Modal/ReviewDetailModal'),
  {
    ssr: false,
  }
);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <DynamicReviewDeatailModal
          reviewId={item.id}
          isModalOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
        />
      )}
      <div className={css.wrap} onClick={() => setIsModalOpen(true)}>
        <LazyLoad>
          <div
            className={css.img}
            style={{ backgroundImage: `url(${item.imageUrl + '?w=375'})` }}
          />
        </LazyLoad>
        <div className={css.detailWrap}>
          <div className={css.title}>{item.dealName}</div>
          <div className={css.desc}>{item.text}</div>
          {StarItem(item.rating)}
        </div>
      </div>
    </>
  );
}
export default observer(BestReviewItem);
