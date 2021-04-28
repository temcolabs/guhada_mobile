import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import LuckyDrawButton from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('atoms/Button', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('LuckyDrawButton', () => {
  return (
    <LuckyDrawButton
      isActive={boolean('isActive', true)}
      contents={text('contents', '응모하기')}
    />
  );
});
