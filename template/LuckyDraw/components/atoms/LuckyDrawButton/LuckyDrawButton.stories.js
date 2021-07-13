import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import LuckyDrawButton from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('template/LuckyDraw/components/atoms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

stories.add('LuckyDrawButton', () => {
  return (
    <Wrapper>
      <LuckyDrawButton
        isActive={boolean('isActive', true)}
        contents={text('contents', '응모하기')}
        onClick={text('onClick', 'Click event')}
      />
    </Wrapper>
  );
});
