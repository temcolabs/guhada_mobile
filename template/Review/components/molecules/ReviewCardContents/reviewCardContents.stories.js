import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import ReviewCardContents from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/Review/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  padding: 20px;
`;

stories.add('ReviewCardContents', () => {
  return (
    <Wrapper>
      <ReviewCardContents
        title={text('title', '타이틀')}
        contents={text('contents', '컨텐츠')}
      />
    </Wrapper>
  );
});
