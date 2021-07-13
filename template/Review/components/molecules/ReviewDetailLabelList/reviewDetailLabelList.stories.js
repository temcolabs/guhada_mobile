import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, object } from '@storybook/addon-knobs';
import ReviewDetailLabelList from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewDetailLabelList', () => {
  return (
    <Wrapper>
      <ReviewDetailLabelList
        answers={object('answers', [
          { answer: '좁아요' },
          { answer: '생각보다 커요' },
          { answer: '아주 편해요' },
        ])}
        questions={object('questions', [
          { type: '사이즈' },
          { type: '착용감' },
          { type: '발볼' },
        ])}
      />
    </Wrapper>
  );
});
