import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import DeliveryTrackingModal from './DeliveryTrackingModal';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import MypageDeliveryStore from 'stores/mypage/MypageDeliveryStore';
const stories = storiesOf('mypage/shipping', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('DeliveryTrackingModal', () => {
  return (
    <div>
      <DeliveryTrackingModal
        myDelivery={Object.assign(new MypageDeliveryStore({}), {
          isDeliveyTrackingModalOpen: true,
        })}
      />
    </div>
  );
});
