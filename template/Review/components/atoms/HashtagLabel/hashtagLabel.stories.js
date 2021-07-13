import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import ReviewHashtagLabel from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/atoms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewHashtagLabel', () => {
  return (
    <Wrapper>
      <ReviewHashtagLabel
        isClose={boolean('isClose', false)}
        hashtag={text('hashtag', '테스트')}
        onClickHashtag={text('onClickHashtag', 'Click event')}
      />
    </Wrapper>
  );
});
