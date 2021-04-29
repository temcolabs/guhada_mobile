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
import LuckyDrawWarnModal from './index';

const stories = storiesOf('molecules/modal', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

stories.add('LuckyDrawWarnModal', () => {
  return (
    <LuckyDrawWarnModal
      isOpen={boolean('isOpen', true)}
      onClose={text('onClose', 'handler close')}
    />  
  );
});
