import { memo } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

import HashtagFavoriteHeading from '../Atoms/Heading/HashtagFavorite';
import HashTagItem from '../Atoms/Label/HashtagItem';
import { ReviewHashtagWrapper, Contents } from './Styled';

/**
 * ReviewHashtag
 * @param {Array} hashTags : 해시태그 리스트
 * @param {Function} onClickHashtag: 아이템 클릭 핸들러ㄴ
 * @returns
 */
function ReviewHashtag({ hashtags, onClickHashtag }) {
  return (
    <>
      {hashtags?.length ? (
        <ReviewHashtagWrapper>
          <HashtagFavoriteHeading />
          <Contents>
            {hashtags?.map((o) => (
              <HashTagItem
                key={o.id}
                hashtag={o.hashtag}
                onClickHashtag={() => onClickHashtag(o.hashtag)}
              />
            ))}
          </Contents>
        </ReviewHashtagWrapper>
      ) : (
        ''
      )}
    </>
  );
}

ReviewHashtag.propTypes = {
  hashTags: PropTypes.array,
  onClickHashtag: PropTypes.func,
};

export default memo(observer(ReviewHashtag));
