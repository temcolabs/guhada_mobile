import { memo, useState } from 'react';
import dynamic from 'next/dynamic';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import CardRating from './CardRating';
import CardImage from './CardImage';
import CardContents from './CardContents';
import CardProdInfo from './CardProdInfo';

import { Wrapper, CardInfoSection, Divider } from './Styled';

const DynamicReviewDeatailModal = dynamic(
  () => import('template/Review/components/Modal/ReviewDetailModal'),
  {
    ssr: false,
  }
);

/**
 * Review Section
 * @param {Object} review, review item
 * @param {Function} onClickLike, Clicked like
 * @returns
 */
function ReviewSection({ review, onClickLike }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && (
        <DynamicReviewDeatailModal
          reviewId={review?.id}
          isModalOpen={isModalOpen}
          onCloseModal={() => {
            document.documentElement.style.overflow = 'initial';
            setIsModalOpen(false);
          }}
        />
      )}
      <Wrapper onClick={() => setIsModalOpen(true)}>
        {/* 이미지 */}
        <CardImage images={toJS(review?.reviewImageList)} />

        {/* 컨텐츠 */}
        <CardInfoSection>
          {/* 좋아요, 댓글, 별점 */}
          <CardRating review={review} onClickLike={() => onClickLike(review)} />

          {/* 본문 */}
          <CardContents title={review?.nickname} contents={review?.contents} />

          {/* 상품 */}
          <CardProdInfo
            dealId={review?.dealId}
            imageUrl={review?.productImageUrl}
            title={review?.brandName}
            contents={review?.dealName}
          />
        </CardInfoSection>
      </Wrapper>
      <Divider />
    </>
  );
}

ReviewSection.propTypes = {
  review: PropTypes.object.isRequired,
  onClickLike: PropTypes.func.isRequired,
};

export default memo(observer(ReviewSection));
