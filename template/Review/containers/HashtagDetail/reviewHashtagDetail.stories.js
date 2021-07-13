import Router from 'next/router';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import ReviewHashtagDetailTemplate from 'template/Review/containers/HashtagDetail';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('template/Review', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

Router.router.query = {
  hashtag: '구하다',
};

stories.add('ReviewHashtagDetailTemplate', () => {
  return <ReviewHashtagDetailTemplate />;
});
