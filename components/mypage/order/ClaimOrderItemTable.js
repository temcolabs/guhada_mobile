import React from 'react';
import css from './OrderItemTable.module.scss';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import DealOrdered from '../DealOrdered';

/**
 * 주문 클레임 상세내역에 있는 주문 아이템 테이블
 *
 * * orderList는 orderClaimForm claimData 객체를 단순히 배열로 감싼 것
 */
export default function ClaimOrderItemTable({ orderList = [] }) {
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
                {/* 클레임에서 쓰는 데이터가 다르기 때문에 직접 구성해서 전달한다 */}
                <DealOrdered
                  order={Object.assign(order, {
                    originalPrice: order.productPrice, // * 다른 부분. 1개 상품의 가격이 클레임 정보에서는 productPrice다.
                  })}
                  wrapperStyle={{ maxWidth: '560px' }}
                  isPurchaseStatusVisible={false}
                  hasOptionQuantity={false}
                  isPriceVisible={false}
                  isSmallImage={true}
                />
              </td>
              <td>{order.quantity}</td>
              <td>
                {order.shipPrice > 0
                  ? `${order.shipPrice} ${currencyUnit}`
                  : `무료`}
              </td>
              <td>
                <b>{addCommaToNum(order.originalPrice)}</b>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
