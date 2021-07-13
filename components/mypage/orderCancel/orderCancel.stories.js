import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';
import OrderCancelDashboard from './OrderCancelDashboard';
import ClaimSuccessNotiBox from './ClaimSuccessNotiBox';
import CancelItem from './CancelItem';
import RefundInfo from './RefundInfo';
import withCenteredDeco from '.storybook/decorators/withCenteredDeco';
import withMobxDeco from '.storybook/decorators/withMobxDeco';

const stories = storiesOf('mypage/orderCancel', module);

// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));
stories.addDecorator(withCenteredDeco);

stories.add('OrderCancelDashboard', () => {
  return (
    <OrderCancelDashboard
      data={{
        cancel: 0,
        change: 100,
        return: 10,
      }}
    />
  );
});

stories.add('ClaimSuccessNotiBox', () => {
  return (
    <ClaimSuccessNotiBox
      heading={() => (
        <span>
          주문상품의 <b>주문취소</b>가 완료되었습니다.
        </span>
      )}
      desc={() => (
        <span>
          주문상품 취소 처리 현황은 취소 ・ 교환 ・ 반품에서 확인하실 수
          있습니다.
        </span>
      )}
    />
  );
});

stories.add('CancelItem', () => {
  return (
    <CancelItem
      order={object('order', {
        brandName: '구찌',
        discountPrice: 300000,
        expireDate: '2019,5,15',
        imageName: 'dummyimage.png',
        imageUrl:
          'https://d3ikprf0m31yc7.cloudfront.net/images/products/thumb/poc_product_thumbnail.png',
        optionAttribute1: '체리',
        optionAttribute2: 85,
        optionAttribute3: '세모',
        orderDate: [2019, 5, 14],
        orderPrice: 350000,
        originalPrice: 350000,
        prodName: '반팔 프린트 원피스',
        purchaseId: 'TEM12394GUHADA',
        purchaseStatus: 'DELIVERED', //
        purchaseStatusText: '배송 완료', // 주문의 상태값 ,
        quantity: 1,
        season: '19FW',
        sellerId: 25231,
        sellerName: '셀러구하다',
        shipPrice: 2500,
        status: 'DELIVERED',
        statusMessage:
          '기한 내에 입금이 확인되어야, 다음 단계로 진행될 수 있습니다.',
      })}
    />
  );
});

stories.add('RefundInfo', () => {
  return (
    <RefundInfo
      isRefundExpectation={boolean('isRefundExpectation', false)}
      refundResponse={object('refundResponse', {
        totalAmount: 18000,
        totalCancelDiscountPrice: -12000,
        totalCancelOrderPrice: 18000,
        totalCancelProductPrice: 30000,
        totalCancelShipPrice: 0,
        totalPaymentCancelPrice: 17000,
        totalPointCancelPrice: 1000,
      })}
    />
  );
});
