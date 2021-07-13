import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import RecentlyTemplate from 'template/Recently';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('template/Recently', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('RecentlyTemplate', () => {
  return <RecentlyTemplate />;
});
