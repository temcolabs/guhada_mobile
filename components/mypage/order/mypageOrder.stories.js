import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import withMobxDeco from '.storybook/decorators/withMobxDeco';
import withMobile from '.storybook/decorators/withMobile';
import {
  withKnobs,
  object,
  // boolean,
  number,
  select,
  boolean,
  // color,
  // select,
} from '@storybook/addon-knobs';
// import OrderDashboard from './OrderDashboard';
import OrderItem from './OrderItem';
// import OrderActionButtonConductor from './OrderActionButtonConductor';
// import OrderItemTable from './OrderItemTable';
// import PaymentInfo from './PaymentInfo';
// import withCenteredDeco from '.storybook/decorators/withCenteredDeco';
// import PaymentInfoPopover from './PaymentInfoPopover';
// import ClaimPaymentInfo from './ClaimPaymentInfo';
// import OrderConfirmModal from './OrderConfirmModal';
// import PaymentAccountInfo from './PaymentAccountInfo';

const SAMPLE_ORDER_DATA = {
  purchaseStatus: 'WAITING_PAYMENT',
  purchaseStatusText: '입금 대기중',
  reviewId: 350,
  purchaseConfirm: false,
  purchaseId: 13888,
  productId: 12541,
  orderDate: [2019, 6, 21],
  brandName: 'PRADA',
  season: '19FW',
  prodName: 'prada shoulder bag',
  imageName: 'prada_shoulder_bag.jpg',
  imageUrl:
    'https://d3ikprf0m31yc7.cloudfront.net/images/products/thumb/0c7b63e4f8104742ae57ed35a21ab6d7',
  optionAttribute1: '옵션1',
  optionAttribute2: '옵션2',
  optionAttribute3: null,
  quantity: 1,
  discountPrice: 2000,
  originalPrice: 2000,
  orderPrice: 2000,
  shipPrice: 0,
  sellerId: 20,
  sellerName: null,
  statusMessage: null,
  expireDate: [2019, 6, 21],
  orderProdGroupId: 13890,
  shipCompleteDate: null,
  dealId: 12521,
};
const stories = storiesOf('mypage/order', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withMobxDeco({}));
stories.addDecorator(withMobile);

// stories.add('OrderDashboard', () => {
//   return (
//     <OrderDashboard
//       data={{
//         deliveryComplete: number('deliveryComplete', 10),
//         paymentComplete: number('paymentComplete', 0),
//         prepareProduct: number('prepareProduct', 13),
//         sending: number('sending', 55),
//         waitingPayment: number('waitingPayment', 300),
//       }}
//     />
//   );
// });

stories.add('OrderItem', () => {
  return (
    <OrderItem order={object('order', SAMPLE_ORDER_DATA)} isClaim={false} />
  );
});

// stories.add(
//   'OrderActionButtonConductor',
//   () => {
//     return (
//       <OrderActionButtonConductor
//         isPurchaseStatusVisible={boolean('isPurchaseStatusVisible', false)}
//         order={object('order', SAMPLE_ORDER_DATA)}
//         isTest={boolean('isTest', false)}
//         isClaim={boolean('isClaim', false)}
//         wrapperStyle={{ width: '80px', height: '300px' }}
//       />
//     );
//   },
//   {
//     notes: `status는 purchaseStatus. UI 테스트에서만 사용합니다. 실제로 사용할 때 전달하지 않아도 됩니다.`,
//   }
// );

// stories.add('OrderItemTable', () => {
//   return (
//     <div style={{ margin: '30px 0' }}>
//       <OrderItemTable
//         orderList={[
//           SAMPLE_ORDER_DATA,
//           Object.assign({}, SAMPLE_ORDER_DATA, {
//             sellerId: 2000,
//             sellerName: '잘나가는집',
//           }),
//           Object.assign({}, SAMPLE_ORDER_DATA, {}),
//           Object.assign({}, SAMPLE_ORDER_DATA, {
//             sellerId: 2000,
//             sellerName: '잘나가는집',
//           }),
//         ]}
//       />
//     </div>
//   );
// });

// stories.add('PaymentInfo', () => {
//   return (
//     <div style={{ width: '920px' }}>
//       <PaymentInfo order={SAMPLE_ORDER_DATA} />
//     </div>
//   );
// });

// stories.add('ClaimPaymentInfo', () => {
//   return (
//     <div style={{ width: '920px' }}>
//       <ClaimPaymentInfo order={{}} />
//     </div>
//   );
// });

// stories.add('PaymentInfoPopover', () => {
//   return <PaymentInfoPopover />;
// });

// stories.add('PaymentAccountInfo/신용카드', () => {
//   return (
//     <div style={{ width: '400px' }}>
//       <PaymentAccountInfo
//         payment={{
//           paymentStatus: 'COMPLETE_PAYMENT',
//           parentMethod: 'Card',
//           method: 'KB국민카드',
//           cardQuota: '0',
//           amount: 13900,
//           cashReceiptNo: 0,
//           cashReceiptUsage: null,
//           cashReceiptType: null,
//           vbankBankName: '%',
//           vbankNo: null,
//           vbankDepositorName: null,
//           vbankRemitterName: null,
//           vbankExpireAt: null,
//           vbankExpireTimestamp: null,
//           mobileCorp: null,
//           mobileNo: null,
//           mobileVanCd: null,
//           requestAt: [2019, 10, 22, 5, 34, 45],
//           requestTimestamp: 1571722485000,
//           completeAt: [2019, 10, 22, 5, 35, 21],
//           completeTimestamp: 1571722521000,
//           pointPayment: 0,
//         }}
//       />
//     </div>
//   );
// });

// stories.add('PaymentAccountInfo/실시간계좌이체', () => {
//   return (
//     <div style={{ width: '400px' }}>
//       <PaymentAccountInfo
//         payment={{
//           paymentStatus: 'COMPLETE_PAYMENT',
//           parentMethod: 'DirectBank',
//           method: 'KB국민카드',
//           cardQuota: '0',
//           amount: 13900,
//           cashReceiptNo: 0,
//           cashReceiptUsage: null,
//           cashReceiptType: null,
//           vbankBankName: '%',
//           vbankNo: null,
//           vbankDepositorName: null,
//           vbankRemitterName: null,
//           vbankExpireAt: null,
//           vbankExpireTimestamp: null,
//           mobileCorp: null,
//           mobileNo: null,
//           mobileVanCd: null,
//           requestAt: [2019, 10, 22, 5, 34, 45],
//           requestTimestamp: 1571722485000,
//           completeAt: [2019, 10, 22, 5, 35, 21],
//           completeTimestamp: 1571722521000,
//           pointPayment: 0,
//         }}
//       />
//     </div>
//   );
// });

// stories.add('PaymentAccountInfo/무통장입금', () => {
//   return (
//     <div style={{ width: '400px' }}>
//       <PaymentAccountInfo
//         payment={{
//           paymentStatus: 'COMPLETE_PAYMENT',
//           parentMethod: 'VBank',
//           method: 'KB국민카드',
//           cardQuota: '0',
//           amount: 13900,
//           cashReceiptNo: 0,
//           cashReceiptUsage: null,
//           cashReceiptType: null,
//           vbankBankName: '은행이름',
//           vbankNo: '010929292929',
//           vbankDepositorName: null,
//           vbankRemitterName: null,
//           vbankExpireAt: null,
//           vbankExpireTimestamp: 1572257580407,
//           mobileCorp: null,
//           mobileNo: null,
//           mobileVanCd: null,
//           requestAt: [2019, 10, 22, 5, 34, 45],
//           requestTimestamp: 1571722485000,
//           completeAt: [2019, 10, 22, 5, 35, 21],
//           completeTimestamp: 1571722521000,
//           pointPayment: 0,
//         }}
//       />
//     </div>
//   );
// });

// stories.add('OrderConfirmModal', () => {
//   return (
//     <OrderConfirmModal
//       isOpen
//       order={{
//         brandName: '브랜드 이름',
//         prodName: '19FW 반소매 프린트 레이스 긴소매 프릴 스퀘어넥 패',
//         imageUrl:
//           'https://dolh13ote4loq.cloudfront.net/images/products/thumb/fafac5ff99cc4e22a5b40010ae94a151',
//       }}
//       dueSavePointOnConfirm={2000}
//       dueSavePointOnReview={5000}
//     />
//   );
// });
