import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number, object } from '@storybook/addon-knobs';
import LuckyDrawTimer from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('molecules/Timer', module);
const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('LuckyDrawTimer', () => {
  return (
    <Wrapper>
      <LuckyDrawTimer
        day={text('day', '2')}
        date={text('date', '10:00:00')} />
    </Wrapper>
  );
});


