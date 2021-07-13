import { useCallback } from 'react';
import css from './ClaimOrderItemTable.module.scss';
import OrderItemForDetail from './OrderItemForDetail';

/**
 * 주문 클레임 상세내역에 있는 주문 아이템 테이블
 *
 * * orderList는 orderClaimForm claimData 객체를 단순히 배열로 감싼 것
 */
export default function ClaimOrderItemTable({ orderList = [] }) {
  // 주문 상품을 셀러로 정렬한다
  const orderListGroupBySeller = orderList.sort((a, b) => {
    return parseInt(a.sellerId) - parseInt(b.sellerId);
  });

  const handleOpenSellerClaimModal = useCallback(() => {}, []);

  return (
    <div className={css.orderItemTable}>
      {orderListGroupBySeller.map((order, index) => {
        return (
          // 클레임에서 쓰는 데이터가 다르기 때문에 직접 구성해서 전달한다
          <OrderItemForDetail
            key={index}
            order={Object.assign(order, {
              originalPrice: order.productPrice, // * 다른 부분. 1개 상품의 가격이 클레임 정보에서는 productPrice다.
            })}
            isClaim={true}
            onClickInquire={handleOpenSellerClaimModal}
          />
        );
      })}
    </div>
  );
}
