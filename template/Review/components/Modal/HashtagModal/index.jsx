import React, { useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';

import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import ReviewHashtag from 'template/Review/components/HashTags';
import HashtagItem from 'template/Review/components/Atoms/Label/HashtagItem';
import Image from 'components/atoms/Image';

import {
  Wrapper,
  Container,
  Header,
  HeaderFlagSection,
  HeaderInputSection,
  HeaderInput,
  Contents,
  ContentAutoCompleteSection,
  ContentsInputTagSection,
} from './Styled';

const IMAGE_PATH = {
  back: '/static/icons/btn_top_back/btn_top_back.png',
  delete: '/static/icon/icon_keyword_delete.png',
};

/**
 * 리뷰 작성 > 해시태그 추가 모달
 * @param {Boolean} isOpen, Modal open
 * @param {String} delHashtag, 부모에서 지운 Hashtag Item
 * @param {Function} onClose, Modal close
 * @returns
 */
function HashtagModal({ isOpen, onClose, delHashtag }) {
  const { review: reviewStore } = useStores();
  const [value, setValue] = useState(''); // 입력 State
  const [hashtags, setHashtags] = useState([]); // 입력 해시태그 리스트

  const reviewAutoCompleteList = reviewStore?.reviewAutoCompleteList;

  /**
   * Side effects
   */

  // 인기 해시태그 조회
  useEffect(() => {
    reviewStore.getReviewHashtags();
  }, []);

  // Input 초기화
  useEffect(() => {
    if (!value) reviewStore.initReviewHashtag();
  }, [value]);

  // 부모에서 삭제한 해시태그 처리
  useEffect(() => {
    if (delHashtag) onClickHashtagItem(delHashtag);
  }, [delHashtag]);

  /**
   * Handlers
   */

  // 연관 해시태그 조회
  const onDebounceChange = (e) => {
    const value = e.target.value;
    setValue(value);
    debounceSomethingFunc(value);
  };

  // 모달 닫기
  const onCloseModal = () => onClose(hashtags);

  // 자동완성 > 해시태그 선택
  const onClickAutoCompleteTag = (hashtag) => {
    const checkHashtag = hashtags.find((v) => v === hashtag);
    setValue('');

    if (hashtag && !checkHashtag) {
      setHashtags([...hashtags, hashtag]);
    }
  };

  // 해시태그 > X버튼 클릭
  const onClickHashtagItem = (hashtag) => {
    const _hashtags = hashtags.filter((v) => v !== hashtag);
    setHashtags(_hashtags);
  };

  // 입력창 > 해시태그 입력 > Enter
  const handleInputHashtag = (e) => {
    const hashtag = e.target.value;
    const checkHashtag = hashtags.find((v) => v === hashtag);

    if (e.key === 'Enter' && hashtag && !checkHashtag) {
      setValue('');
      setHashtags([...hashtags, hashtag]);
    }
  };

  /**
   * Helpers
   */

  // 연관 해시태그 조회 debounce
  const debounceSomethingFunc = debounce((hashtag) => {
    reviewStore.getReviewAutoComplete({ hashtag });
  }, 100);

  return (
    <SlideIn isVisible={isOpen} zIndex={9999} direction={slideDirection.BOTTOM}>
      <Wrapper>
        <Container>
          {/* Header */}
          <Header>
            {/* Header Flag Section */}
            <HeaderFlagSection>
              <span onClick={onCloseModal}>
                <Image src={IMAGE_PATH.back} width={'30px'} height={'30px'} />
              </span>
              <span>#</span>
            </HeaderFlagSection>
            {/* Header Input Section */}
            <HeaderInputSection>
              <div>
                <HeaderInput
                  type={'text'}
                  value={value}
                  onChange={onDebounceChange}
                  onKeyPress={handleInputHashtag}
                />
              </div>
              <div onClick={() => setValue('')}>
                <Image src={IMAGE_PATH.delete} width={'20px'} height={'20px'} />
              </div>
            </HeaderInputSection>
          </Header>

          {/* Contents */}
          <Contents>
            {/* 해시태그 자동완성 */}
            {reviewAutoCompleteList && reviewAutoCompleteList.length ? (
              reviewAutoCompleteList.map((hashtag) => (
                <ContentAutoCompleteSection
                  onClick={() => onClickAutoCompleteTag(hashtag)}
                >
                  # {hashtag}
                </ContentAutoCompleteSection>
              ))
            ) : (
              <div>
                {/* 해시태그 인기 리스트 */}
                {reviewStore.reviewHashtagList &&
                reviewStore.reviewHashtagList.length ? (
                  <ReviewHashtag
                    hashtags={toJS(reviewStore?.reviewHashtagList)}
                    onClickHashtag={(hashtag) => onClickHashtagItem(hashtag)}
                  />
                ) : (
                  ''
                )}

                {/* 해시태그 입력 리스트 */}
                {hashtags && hashtags.length ? (
                  <ContentsInputTagSection>
                    {hashtags.map((hashtag) => (
                      <HashtagItem
                        isClose={true}
                        hashtag={hashtag}
                        onClickHashtag={() => onClickHashtagItem(hashtag)}
                      />
                    ))}
                  </ContentsInputTagSection>
                ) : (
                  ''
                )}
              </div>
            )}
          </Contents>
        </Container>
      </Wrapper>
    </SlideIn>
  );
}

HashtagModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  delHashtag: PropTypes.string,
  onClose: PropTypes.func,
};

export default memo(observer(HashtagModal));
