import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
// import CommentsList from './CommentsList';

const stories = storiesOf('community/comment', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withMobxDeco({}));
stories.addDecorator(withKnobs);
stories.addDecorator(withCenteredDeco);

stories.add('CommentInput', () => {
  return <CommentInput />;
});

stories.add('CommentItem', () => {
  return (
    <div style={{ width: '890px' }}>
      <CommentItem />
    </div>
  );
});

stories.add('CommentsList', () => {
  return <CommentsList />;
});
