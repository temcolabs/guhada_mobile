import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper,
  CardImageSection,
  CardImageSectionItem,
  CardInfoSection,
  CardInfoRatingSection,
  CardInfoLikeAndComment,
  CardContentsSection,
  CardProductSection,
  Divider,
} from './Styled';

import StarItem from 'components/mypage/review/StarItem';
import Image from 'components/atoms/Image';
import Slider from 'components/molecules/Slider';

const settings = {
  arrows: false,
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  variableWidth: true,
};

const IMAGE_PATH = {
  comment: '/static/icons/button/comment/comment.png',
  likeOn: '/static/icons/button/like_on/like_on.png',
  likeOff: '/static/icons/button/like_off/like_off.png',
};

function ReviewCard({ review }) {
  /**
   * States
   */
  const sliderRef = useRef(null);

  /**
   * Side Effects
   */

  /**
   * Custom react-slick
   */
  useEffect(() => {
    let slickSlides = document.querySelectorAll('.slick-slide');
    let slickTracks = document.querySelectorAll('.slick-track');
    if (slickSlides && slickSlides.length) {
      slickSlides.forEach((o, i) => {
        o.style.marginRight = '7px';
      });
    }

    if (slickTracks && slickTracks.length) {
      slickTracks.forEach((o, i) => {
        o.style.margin = '0 20px';
      });
    }
  }, [sliderRef.current]);

  /**
   * Helpers
   */

  /**
   * Slider Item 생성
   * @param {array} list: reviews
   * @returns
   */
  const createReviewImages = (list) => {
    return list && list.length
      ? list.map((src, i) => (
          <div key={`createReviewImages-${i}`} style={{ width: '320px' }}>
            <Image src={src} width={'auto'} height={'320px'} />
          </div>
        ))
      : '';
  };

  return (
    <>
      <Wrapper>
        {/* 이미지 영역 */}
        <CardImageSection>
          {review?.reviewImageList.length <= 1 ? (
            <CardImageSectionItem>
              <Image
                src={review.reviewImageList[0]}
                width={'auto'}
                height={'320px'}
              />
            </CardImageSectionItem>
          ) : (
            <Slider
              ref={sliderRef}
              children={createReviewImages(review?.reviewImageList)}
              settings={settings}
            />
          )}
        </CardImageSection>
        {/* 컨텐츠 영역 */}
        <CardInfoSection>
          {/* 좋아요, 댓글 & 별점 */}
          <CardInfoRatingSection>
            {/* 좋아요 & 댓글 */}
            <CardInfoLikeAndComment>
              <div>
                <Image
                  src={
                    review?.myBookmarkReview
                      ? IMAGE_PATH.likeOn
                      : IMAGE_PATH.likeOff
                  }
                  width={'17px'}
                  height={'15px'}
                />
                <div>{review?.bookmarkCount}</div>
              </div>
              <div>
                <Image
                  src={IMAGE_PATH.comment}
                  width={'15.333px'}
                  height={'15px'}
                />
                <div>{review?.commentCount}</div>
              </div>
            </CardInfoLikeAndComment>
            {/* 별점 */}
            <div>{StarItem(review?.rating)}</div>
          </CardInfoRatingSection>
          {/* 본문 */}
          <CardContentsSection>
            <span className={'nick-name'}>{review?.nickname}</span>{' '}
            <span className={'contents'}>{review?.contents}</span>
          </CardContentsSection>
          {/* 상품 */}
          <CardProductSection>
            <div>
              <Image
                src={review?.productImageUrl}
                width={'50px'}
                height={'50px'}
              />
            </div>
            <div>
              <div className={'nick-name'}>{review?.brandName}</div>
              <div className={'contents'}>{review?.dealName}</div>
            </div>
          </CardProductSection>
        </CardInfoSection>
      </Wrapper>
      <Divider />
    </>
  );
}

ReviewCard.propTypes = {};

export default ReviewCard;
