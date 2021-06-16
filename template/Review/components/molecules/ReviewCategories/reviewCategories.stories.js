import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import ReviewCategories from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import { REVIEW_CATEGORY_LIST } from 'template/Review/_constants';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewCategories', () => {
  return (
    <Wrapper>
      <ReviewCategories
        categories={object('categories', REVIEW_CATEGORY_LIST)}
        onClickCategory={text('onClickLike', 'Updated to category list')}
      />
    </Wrapper>
  );
});
