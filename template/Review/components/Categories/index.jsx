import React, { useState, useEffect } from 'react';
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

function ReviewCategories({ categories }) {
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
  const onClickCategoryItem = (idx) => {
    // TODO : ReviewStore > Search
    setList(
      list.map((o, i) =>
        idx === i ? { ...o, isSelect: true } : { ...o, isSelect: false }
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
      <Contents>
        {list?.map((o, i) => (
          <ContentItem key={o.id} onClick={() => onClickCategoryItem(i)}>
            <CategoryImage>
              <Image
                src={o.isSelect ? o.categoryImageOn : o.categoryImageOff}
                width={'54px'}
                height={'54px'}
              />
            </CategoryImage>
            <CategoryText className={o.isSelect ? 'active' : 'inActive'}>
              {o.categoryName}
            </CategoryText>
          </ContentItem>
        ))}
      </Contents>
    </Wrapper>
  );
}

ReviewCategories.propTypes = {
  categories: PropTypes.array.isRequired,
};

export default ReviewCategories;
