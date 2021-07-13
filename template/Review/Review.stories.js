import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import ReviewTemplate from 'template/Review';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('template/Review', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('ReviewTemplate', () => {
  return <ReviewTemplate />;
});
