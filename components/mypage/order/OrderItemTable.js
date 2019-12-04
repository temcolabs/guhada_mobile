import React from 'react';
import css from './OrderItemTable.module.scss';
import OrderItem from './OrderItem';

export default class OrderItemTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // 판매자 문의하기 모달
      sellerClaimModal: {
        sellerId: null,
        orderProdGroupId: null,
        isOpen: false,
      },
    };
  }

  handleOpenSellerClaimModal = (order = {}) => {
    this.setState({
      sellerClaimModal: {
        sellerId: order.sellerId,
        orderProdGroupId: order.orderProdGroupId,
        isOpen: true,
      },
    });
  };

  handleCloseSellerClaimModal = () => {
    this.setState({
      sellerClaimModal: {
        sellerId: null,
        orderProdGroupId: null,
        isOpen: false,
      },
    });
  };

  render() {
    // 주문 상품을 셀러로 정렬한다
    const orderListGroupBySeller = this.props.orderList?.sort((a, b) => {
      return parseInt(a.sellerId) - parseInt(b.sellerId);
    });

    return (
      <div className={css.orderItemTable}>
        {orderListGroupBySeller?.map((order, index) => {
          return (
            <OrderItem
              key={index}
              order={order}
              isClaim={false}
              onClickInquire={this.handleOpenSellerClaimModal}
            />
          );
        })}
      </div>
    );
  }
}
