import { storiesOf } from '@storybook/react';
import {
  withKnobs,
  text,
  boolean,
  number,
  color,
  select,
} from '@storybook/addon-knobs';
import QuickDeliveryTrackingModal from './QuickDeliveryTrackingModal';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import MypageDeliveryStore from 'stores/mypage/MypageDeliveryStore';
const stories = storiesOf('mypage/quickShipping', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));

stories.add('QuickDeliveryTrackingModal', () => {
  return (
    <div>
      <QuickDeliveryTrackingModal
        myDelivery={Object.assign(new MypageDeliveryStore({}), {
          isQuickDeliveyTrackingModalOpen: true,
        })}
      />
    </div>
  );
});
