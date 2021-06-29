import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, object } from '@storybook/addon-knobs';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import DeliveryDelayModal from './index';

const stories = storiesOf('organisms/Modals', module);
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

stories.add('DeliveryDelayModal', () => {
  return (
    <Wrapper>
      <DeliveryDelayModal
        isOpen={boolean('isOpen', true)}
        onClose={text('onClose', 'Close event')}
        order={object('order', {
          delayDeadlineTimestamp: 1619794799000,
          delayReason: '상품준비중',
          delayReasonDetail: '가내 수공업 제품으로 인한 발송지연',
        })}
      />
    </Wrapper>
  );
});
