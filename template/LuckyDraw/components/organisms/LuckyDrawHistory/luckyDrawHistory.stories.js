import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import LuckyDrawHistory from './index';

import test from './_sample.json';

const stories = storiesOf('template/LuckyDraw/components/organisms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

const winnerList = JSON.parse(JSON.stringify(test));

stories.add('LuckyDrawHistory', () => {
  return (
    <LuckyDrawHistory
      winnerList={object('winnerList', winnerList)}
      onClickHistory={text('onClickHistory', 'Click event')}
    />
  );
});
