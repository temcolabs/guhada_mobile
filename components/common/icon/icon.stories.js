import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import Notimark from './Notimark';
import QuestionMark from './QuestionMark';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';

const stories = storiesOf('common/icon', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withCenteredDeco);

stories.add('Notimark', () => {
  return (
    <div style={{ textAlign: 'left' }}>
      <Notimark />
      <span>
        <code>Notimark</code> has <code>inline-block</code> style as{' '}
        <code>display</code> property
      </span>
    </div>
  );
});

stories.add('QuestionMark', () => {
  return (
    <div>
      <QuestionMark />
      <span>
        <code>QuestionMark</code> has <code>inline-block</code> style as{' '}
        <code>display</code> property
      </span>
    </div>
  );
});
