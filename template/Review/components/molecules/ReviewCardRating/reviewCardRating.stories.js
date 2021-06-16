import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import ReviewCardRating from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewCardRating', () => {
  return (
    <Wrapper>
      <ReviewCardRating
        review={object('review', {
          bookmarkCount: 1,
          commentCount: 7,
          myBookmarkReview: true,
          rating: 'HALF', // StarItem.js
        })}
        onClickLike={text('onClickLike', 'Like flag on / off')}
      />
    </Wrapper>
  );
});
