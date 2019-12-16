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
        isModalOpen={boolean('isModalOpen', true)}
        isOpenOnMount={boolean('isOpenOnMount', false)}
        myDelivery={Object.assign(new MypageDeliveryStore({}), {
          deliveryInfo: {
            level: 5,
            invoiceNo: '12341234',
            companyName: '택배회사',
            senderName: '판매자이름',
            receiverName: '산놈',
            receiverAddr:
              '산놈주소 Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta soluta inventore itaque voluptate reprehenderit impedit quod voluptatum doloremque tempore iste. Ab excepturi optio ipsum vel sunt cumque nobis cum aliquam!',
            trackingDetails: [
              {
                timeString: +new Date(),
                where: '강남B1',
                manName: '배달원',
                telno: '02-543-9965',
                kind: '상품이 배달지역에 도착하였습니다.',
              },
              {
                timeString: +new Date(),
                where: '강남B1',
                manName: '배달원',
                telno: '02-543-9965',
                kind: '상품이 배달지역에 도착하였습니다.',
              },
              {
                timeString: +new Date(),
                where: '강남B1',
                manName: '배달원',
                telno: '02-543-9965',
                kind: '상품이 배달지역에 도착하였습니다.',
              },
              {
                timeString: +new Date(),
                where: '강남B1',
                manName: '배달원',
                telno: '02-543-9965',
                kind: '상품이 배달지역에 도착하였습니다.',
              },
            ],
          },
        })}
      />
    </div>
  );
});
