import { useState, useEffect, memo } from 'react';
import dynamic from 'next/dynamic';
import { observer } from 'mobx-react';
import { useScrollPosition } from 'hooks';
import useStores from 'stores/useStores';

import Image from 'components/atoms/Image';
import DefaultLayout from 'components/layout/DefaultLayout';
import { Menus, MenuItem, Contents, ContentItem } from './Styled';
import Router from 'next/router';

const DynamicReviewDeatailModal = dynamic(
  () => import('template/Review/components/Modal/ReviewDetailModal'),
  {
    ssr: false,
  }
);

const initialSearch = {
  hashtag: '',
  sortType: 'popularity',
  page: 1,
  unitPerPage: 15,
};

/**
 * 해시태그 > 상세 리스트 (연관)
 * @returns
 */
function ReviewHashtagDetail() {
  const { review: reviewStore } = useStores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuToggle, setIsMenuToggle] = useState(true);
  const [reviewId, setReviewId] = useState(0);
  const [search, setSearch] = useState(initialSearch);

  const scrollPosition = useScrollPosition();

  // 페이지 초기화
  useEffect(() => {
    const hashtag = Router?.router?.query?.hashtag;
    reviewStore.getSearchReviewHashtags({ ...search, hashtag });
    setSearch({ ...search, hashtag });
    return () => {
      reviewStore.initReviewHashtag();
      setSearch(initialSearch);
      document.documentElement.style.overflow = 'initial';
    };
  }, []);

  // 스크롤 조회
  useEffect(() => {
    if (scrollPosition > 0.7) {
      getList();
    }

    async function getList() {
      const reviewPage = reviewStore?.reviewHashtagDetail;
      if (!reviewPage.last) {
        document.documentElement.style.overflow = 'hidden';
        const _search = { ...search, page: search.page + 1 };

        await reviewStore.getSearchReviewHashtags(_search);
        setSearch(_search);
        document.documentElement.style.overflow = 'initial';
      }
    }
  }, [reviewStore, scrollPosition]);

  /**
   * 인기순 메뉴 클릭
   */
  const onClickPopularity = async () => {
    const _search = { ...search, sortType: 'popularity', page: 1 };
    reviewStore.initReviewHashtag();
    setIsMenuToggle(true);
    setSearch(_search);
    await reviewStore.getSearchReviewHashtags(_search);
  };

  /**
   * 최신순 메뉴 클릭
   */
  const onClickCreatedAt = async () => {
    const _search = { ...search, sortType: 'createdAt', page: 1 };
    reviewStore.initReviewHashtag();
    setIsMenuToggle(false);
    setSearch(_search);
    await reviewStore.getSearchReviewHashtags(_search);
  };

  /**
   * 리뷰 상세 보기 모달
   * @param {Number} reviewId
   */
  const onClickHashtagItem = (reviewId) => {
    setReviewId(reviewId);
    setIsModalOpen(true);
  };

  return (
    <>
      {isModalOpen && (
        <DynamicReviewDeatailModal
          reviewId={reviewId}
          isModalOpen={isModalOpen}
          onCloseModal={() => {
            document.documentElement.style.overflow = 'initial';
            setIsModalOpen(false);
          }}
        />
      )}
      <DefaultLayout
        kakaoChat={false}
        topButton={false}
        toolBar={false}
        pageTitle={`테스트`}
        headerShape={'review'}
        topLayout={'main'}
      >
        <Menus>
          <MenuItem active={isMenuToggle} onClick={onClickPopularity}>
            인기순
          </MenuItem>
          <MenuItem active={!isMenuToggle} onClick={onClickCreatedAt}>
            최신순
          </MenuItem>
        </Menus>
        <Contents>
          {reviewStore?.reviewHashtagDetailList &&
            reviewStore.reviewHashtagDetailList.map((o, i) => (
              <ContentItem
                key={`${o.id}-${i}`}
                index={i + 1}
                onClick={() => onClickHashtagItem(o.id)}
              >
                <Image src={o.reviewImageUrl} />
              </ContentItem>
            ))}
        </Contents>
      </DefaultLayout>
    </>
  );
}

ReviewHashtagDetail.propTypes = {};

export default memo(observer(ReviewHashtagDetail));
