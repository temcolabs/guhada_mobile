import { memo } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { stringify } from 'qs';

import HashtagFavoriteHeading from '../Atoms/Heading/HashtagFavorite';
import HashTagItem from '../Atoms/Label/HashtagItem';
import { Wrapper, Contents } from './Styled';

import { pushRoute } from 'childs/lib/router';

/**
 * ReviewHashtag
 * @param {Array} hashTags : 해시태그 리스트
 * @returns
 */
function ReviewHashtag({ hashTags }) {
  return (
    <>
      {hashTags?.length ? (
        <Wrapper>
          <HashtagFavoriteHeading />
          <Contents>
            {hashTags?.map((o) => (
              <HashTagItem
                key={o.id}
                hashtag={o.hashtag}
                onClickHashtag={() =>
                  pushRoute(
                    `/review/hashtag?${stringify({ hashtag: o.hashtag })}`
                  )
                }
              />
            ))}
          </Contents>
        </Wrapper>
      ) : (
        ''
      )}
    </>
  );
}

ReviewHashtag.propTypes = {
  hashTags: PropTypes.array.isRequired,
};

export default memo(observer(ReviewHashtag));
