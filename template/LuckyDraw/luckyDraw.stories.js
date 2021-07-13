import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import '.storybook/decorators/withRouterDeco';

import LuckyDrawTemplate from './index';

const stories = storiesOf('template/LuckyDraw', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

stories.add('LuckyDrawTemplate', () => {
  return <LuckyDrawTemplate />;
});
