import { memo, useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  Wrapper,
  Title,
  Contents,
  ContentItem,
  CategoryImage,
  CategoryText,
} from './Styled';

import { Image } from 'components/atoms';

// TODO : Styled-components Sprite
const IMAGE_PATH = {
  title: '/static/icons/text/text_category/text_category_kr.png',
  emoji: '/static/icons/emoji/emoji_finger_fire/emoji_finger_fire.png',
};

function ReviewCategories({ categories, onClickCategory }) {
  /**
   * State
   */
  const [list, setList] = useState([]);

  /**
   * Side Effects
   */
  useEffect(() => {
    setList(categories);
    return () => setList([]);
  }, [categories]);

  /**
   * Handlers
   */
  const _onClickCategory = (categoryName) => {
    // TODO : ReviewStore > Search
    onClickCategory(categoryName);
    setList(
      list.map((o) =>
        categoryName === o.categoryName
          ? { ...o, isSelect: true }
          : { ...o, isSelect: false }
      )
    );
  };

  /**
   * Render
   */
  return (
    <Wrapper>
      <Title>
        <Image src={IMAGE_PATH.title} width={'55px'} />
      </Title>
      {list && list.length ? (
        <Contents>
          {list?.map((o, i) => (
            <ContentItem
              key={`ReviewCategories-${i}`}
              onClick={() => _onClickCategory(o.categoryName)}
            >
              <CategoryImage>
                <Image
                  src={o.isSelect ? o.categoryImageOn : o.categoryImageOff}
                  width={'55px'}
                  height={'55px'}
                />
              </CategoryImage>
              <CategoryText className={o.isSelect ? 'active' : 'inActive'}>
                {o.categoryName}
              </CategoryText>
            </ContentItem>
          ))}
        </Contents>
      ) : (
        ''
      )}
    </Wrapper>
  );
}

ReviewCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  onClickCategory: PropTypes.func.isRequired,
};

export default memo(observer(ReviewCategories));
