import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import ReviewFavoriteHashtagList from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewFavoriteHashtagList', () => {
  return (
    <Wrapper>
      <ReviewFavoriteHashtagList
        wrapperStyles={object('wrapperStyles')}
        headingStyles={object('headingStyles')}
        hashtags={object('hashtags', [
          { id: 1, hashtag: '샤넬' },
          { id: 2, hashtag: 'GUHADA' },
          { id: 3, hashtag: '구하다' },
        ])}
        onClickHashtag={text('onClickHashtag', 'Moved to hashtag list')}
      />
    </Wrapper>
  );
});
