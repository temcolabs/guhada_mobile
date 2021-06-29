import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import LuckyDrawModal from './index';

const stories = storiesOf('template/LuckyDraw/components/organisms', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco());

stories.add('LuckyDrawModal', () => {
  return (
    <LuckyDrawModal
      isOpen={boolean('isOpen', true)}
      status={select('status', ['START', 'WINNER_ANNOUNCEMENT', 'CLIP'])}
      contents={text('contents', '럭키드로우 응모가 완료 되었습니다.')}
      onClose={text('onClose', 'handler close')}
    />
  );
});
