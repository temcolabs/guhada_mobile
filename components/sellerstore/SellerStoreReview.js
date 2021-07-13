import { useState, useEffect } from 'react';
import useStores from 'stores/useStores';
import SellerReviewItem from './SellerReviewItem';
import MoreButton from 'components/common/MoreButton';
import SellerReviewEmpty from './SellerReviewEmpty';
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
          {sellerReview.reviewPage * sellerReview.unitPerPage >
          sellerReview.totalElements ? null : (
            <MoreButton
              getMoreContent={sellerReview.getMoreReview}
              // wrapStyle={{ borderTop: '1px solid #eee' }}
            />
          )}
        </>
      ) : (
        <SellerReviewEmpty />
      )}
    </div>
  );
});

export default SellerStoreReview;
