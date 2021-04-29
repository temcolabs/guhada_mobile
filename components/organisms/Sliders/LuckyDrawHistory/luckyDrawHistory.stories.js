import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, array } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import LuckyDrawHistory from './index';

import test from './_sample.json';

const stories = storiesOf('organisms/Sliders', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

const winnerList = JSON.parse(JSON.stringify(test));

stories.add('LuckyDrawHistory', () => {
  return <LuckyDrawHistory winnerList={array('winnerList', winnerList)} />;
});
