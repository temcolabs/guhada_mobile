import React, { useState, useEffect } from 'react';
import useStores from 'stores/useStores';
import SellerReviewItem from './SellerReviewItem';
import MoreButton from 'components/common/MoreButton';
import { observer } from 'mobx-react';

const SellerStoreReview = observer(() => {
  const { seller, sellerReview } = useStores();
  const [review, setReview] = useState([]);
  useEffect(() => {
    sellerReview.sellerId = seller.sellerId;
    sellerReview.getProductReview();
  }, []);

  useEffect(() => {
    setReview(sellerReview.review);
  }, [sellerReview.review]);

  return (
    <div>
      {!_.isNil(review.content) ? (
        <>
          {review.content.map((reviewContent, index) => (
            <SellerReviewItem key={index} review={reviewContent} />
          ))}
          <MoreButton
            getMoreContent={sellerReview.getMoreReview}
            // wrapStyle={{ borderTop: '1px solid #eee' }}
          />
        </>
      ) : // <SellerReviewEmpty maximumPoint={sellerReview.maximumPoint} />
      null}
    </div>
  );
});

export default SellerStoreReview;
