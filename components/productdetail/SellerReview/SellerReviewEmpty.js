import React from 'react';
import css from './SellerReviewEmpty.module.scss';

export default function SellerReviewEmpty({ alert, sellerReview }) {
  return (
    <div className={css.wrap}>
      <img src="/static/icon/icon_review.png" alt="reviewIcon" />
      <div className={css.bold}>작성된 상품 리뷰가 없습니다.</div>
      <div>
        첫 상품 리뷰 작성하고{' '}
        <span
          className={css.colored}
        >{`최대 ${sellerReview.maximumPoint.toLocaleString()}점의 포인트 혜택`}</span>
        을 누려보세요!
      </div>
      <button
        onClick={() =>
          alert.showAlert({ content: '모바일 버전 준비중입니다.' })
        }
      >
        첫 리뷰 작성하기
      </button>
    </div>
  );
}
