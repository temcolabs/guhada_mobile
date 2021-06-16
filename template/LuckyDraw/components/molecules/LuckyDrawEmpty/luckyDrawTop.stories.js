import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import LuckyDrawEmpty from './index';

const stories = storiesOf('template/LuckyDraw/components/molecules', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

stories.add('LuckyDrawEmpty', () => {
  return <LuckyDrawEmpty />;
});
