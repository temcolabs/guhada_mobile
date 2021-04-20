import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, object } from '@storybook/addon-knobs';
import DeliveryDelayModal from './index';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
const stories = storiesOf('molecules/modal', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('DeliveryDelayModal', () => {
  return (
    <DeliveryDelayModal
      isOpen={boolean('isOpen', true)}
      onClose={text('onClose', 'This is close event')}
      order={object('order', {
        delayDeadlineTimestamp: 1619794799000,
        delayReason: '상품준비중',
        delayReasonDetail: '가내 수공업 제품으로 인한 발송지연',
      })}
    />
  );
});
