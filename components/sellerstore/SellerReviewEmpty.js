import css from './SellerReviewEmpty.module.scss';

export default function SellerReviewEmpty() {
  return (
    <div className={css.wrap}>
      <img src="/public/icon/icon_review.png" alt="reviewIcon" />
      <div className={css.bold}>작성된 상품 리뷰가 없습니다.</div>
    </div>
  );
}
