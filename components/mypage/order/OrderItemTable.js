import React from 'react';
import DealOrdered from '../DealOrdered';
import css from './OrderItemTable.module.scss';
import addCommaToNum from 'childs/lib/common/addCommaToNum';

/**
 * 주문 완료 상세내역에 있는 주문 아이템 테이블
 */
export default function OrderItemTable({ orderList = [] }) {
  const currencyUnit = '원';

  // 주문 상품을 셀러로 정렬한다
  const orderListGroupBySeller = orderList.sort((a, b) => {
    return parseInt(a.sellerId) - parseInt(b.sellerId);
  });

  return (
    <table className={css.orderItemTable}>
      <thead>
        <tr>
          <th>상품 정보</th>
          <th>수량</th>
          <th>배송비</th>
          <th>상품금액</th>
        </tr>
      </thead>
      <tbody>
        {orderListGroupBySeller.map((order, index) => {
          return (
            <tr key={index}>
              <td>
                <DealOrdered
                  order={order}
                  wrapperStyle={{ maxWidth: '560px' }}
                  isClaim={false}
                  isSmallImage={true}
                  isBrandAndProductInSameLine={true}
                  hasOptionQuantity={false}
                  isPurchaseStatusVisible={false}
                  isPriceVisible={false}
                />
              </td>
              <td>{order.quantity}개</td>
              <td>
                {order.shipPrice > 0
                  ? `${order.shipPrice} ${currencyUnit}`
                  : `무료`}
              </td>
              <td>
                <b>{addCommaToNum(order.originalPrice)}원</b>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
