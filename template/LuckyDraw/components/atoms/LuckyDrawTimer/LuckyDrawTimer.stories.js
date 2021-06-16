import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';
import LuckyDrawTimer from './index';
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

stories.add('LuckyDrawTimer', () => {
  return (
    <Wrapper>
      <LuckyDrawTimer
        day={text('day', '2')}
        date={text('date', '10:00:00')}
        text={select('text', ['', 'to be continue'])}
      />
    </Wrapper>
  );
});
