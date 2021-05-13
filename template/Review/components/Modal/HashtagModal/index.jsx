import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react';
import { useScrollDirection, useScrollPosition } from 'hooks';
import useStores from 'stores/useStores';

import PropTypes from 'prop-types';

import Image from 'components/atoms/Image';
import DefaultLayout from 'components/layout/DefaultLayout';
import { Menus, MenuItem, Contents, ContentItem } from './Styled';

function HashtagModal({ hashtag }) {
  const { review: reviewStore } = useStores();
  const [isMenuToggle, setIsMenuToggle] = useState(true);
  const [search, setSearch] = useState({
    hashtag: '',
    sortType: 'popularity',
    page: 1,
    unitPerPage: 15,
  });

  const scrollDirection = useScrollDirection();
  const scrollPosition = useScrollPosition();

  // 페이지 초기화
  useEffect(() => {
    return () => {
      reviewStore.initReviewHashtag();
      document.documentElement.style.overflow = 'initial';
    };
  }, []);

  useEffect(() => {
    console.log('window.scrollY : ', window.scrollY);
  }, [window.scrollY]);

  // 메뉴 토글, sortType 변경
  useEffect(() => {
    let _search = { ...search, hashtag };
    if (isMenuToggle) _search = { ..._search, sortType: 'popularity' };
    else _search = { ..._search, sortType: 'createdAt' };

    reviewStore.initReviewHashtag();
    reviewStore.getSearchReviewHashtags(_search);
    setSearch(_search);
  }, [isMenuToggle]);

  // Review data imported in infinite scrolls
  useEffect(() => {
    if (scrollPosition > 0.7) {
      console.log('aaa?');
      getList();
    }

    async function getList() {
      const reviewPage = reviewStore?.reviewHashtagDetail;
      if (!reviewPage.last) {
        document.documentElement.style.overflow = 'hidden';
        const _search = { ...search, page: search.page + 1 };

        await reviewStore.getSearchReviewHashtags(search);
        setSearch(_search);
        document.documentElement.style.overflow = 'initial';
      }
    }
  }, [reviewStore, scrollPosition]);

  return (
    <DefaultLayout
      title={null}
      topLayout={'main'}
      scrollDirection={scrollDirection}
    >
      <Menus>
        <MenuItem active={isMenuToggle} onClick={() => setIsMenuToggle(true)}>
          인기순
        </MenuItem>
        <MenuItem active={!isMenuToggle} onClick={() => setIsMenuToggle(false)}>
          최신순
        </MenuItem>
      </Menus>
      <Contents>
        {reviewStore?.reviewHashtagDetailList &&
          reviewStore.reviewHashtagDetailList.map((o) => (
            <ContentItem key={`${o.id}`}>
              <Image src={o.reviewImageUrl} />
            </ContentItem>
          ))}
      </Contents>
    </DefaultLayout>
  );
}

HashtagModal.propTypes = {};

export default observer(HashtagModal);
