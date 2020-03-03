import React from 'react';
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
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';
import DefaultEditor from './DefaultEditor';
import BoardSelector from './BoardSelector';
import BrandSearch from './BrandSearch';
import DealSearch from './DealSearch';
import TempArticleButton from './TempArticleButton';

const stories = storiesOf('community/editor', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));
stories.addDecorator(withCenteredDeco);

stories.add('DefaultEditor', () => {
  return (
    <div style={{ padding: '2rem' }}>
      <DefaultEditor
        initialContents={text(
          'initialContents',
          `<div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloremque consectetur praesentium voluptatem laborum nesciunt excepturi fuga magni debitis blanditiis, iusto facere sapiente officia et natus. Reprehenderit, veniam enim? Possimus, et.</div>`
        )}
      />
    </div>
  );
});

stories.add('BoardSelector', () => {
  return <BoardSelector />;
});

stories.add('BrandSearch', () => {
  return <BrandSearch />;
});

stories.add('DealSearch', () => {
  return <DealSearch />;
});

stories.add('TempArticleButton', () => {
  return <TempArticleButton />;
});
