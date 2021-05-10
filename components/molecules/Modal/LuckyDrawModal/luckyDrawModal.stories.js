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
import LuckyDrawModal from './index';

const stories = storiesOf('molecules/modal', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

stories.add('LuckyDrawModal', () => {
  return (
    <LuckyDrawModal
      isOpen={boolean('isOpen', true)}
      status={text('status', 'START')}
      statusExample={text('statusExample', 'START, WINNER_ANNOUNCEMENT, CLIP')}
      contents={text('contents', '럭키드로우 응모가 완료 되었습니다.')}
      onClose={text('onClose', 'handler close')}
    />  
  );
});
