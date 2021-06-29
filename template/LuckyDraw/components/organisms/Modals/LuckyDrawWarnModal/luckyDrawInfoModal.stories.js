import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import LuckyDrawWarnModal from './index';

const stories = storiesOf('template/LuckyDraw/components/organisms', module);
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
