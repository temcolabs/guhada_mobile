import { Component } from 'react';
import { inject, observer } from 'mobx-react';
import ReviewWriteModal, { reviewModalType } from './ReviewWriteModal';

/**
 * 리뷰 작성, 수정 모달을 컴포너트에 연결
 * @param {*} BaseComponent
 */
export default function withReviewModal(BaseComponent) {
  @inject('orderCompleteList', 'mypagereview', 'alert')
  @observer
  class wrappedComponent extends Component {
    render() {
      const {
        orderCompleteList: orderCompleteListStore,
        mypagereview,
        alert,
      } = this.props;

      const passedProps = Object.assign({}, this.props, {});

      return (
        <div>
          <BaseComponent {...passedProps} />

          {/* 리뷰 작성 모달 */}
          <ReviewWriteModal
            isOpen={mypagereview.isReviewWriteModalOpen}
            handleModalClose={mypagereview.closeReviewModal}
            modalData={mypagereview.orderProdGroup} // 선택한 주문 데이터
            status={reviewModalType.WRITE}
            onSuccessSubmit={() => {
              mypagereview.closeReviewModal();
              orderCompleteListStore.getMyOrders(); //  목록 새로고침
              this.props.alert.showAlert('리뷰가 작성되었습니다.');
            }}
          />

          {/* 리뷰 수정 모달 */}
          <ReviewWriteModal
            isOpen={mypagereview.isReviewModifyModalOpen}
            handleModalClose={mypagereview.closeReviewModal}
            modalData={mypagereview.orderProdGroup} // 선택한 주문 데이터
            status={reviewModalType.MODIFY}
            reviewData={mypagereview.reviewData}
            onSuccessModify={() => {
              mypagereview.closeReviewModal();
              orderCompleteListStore.getMyOrders(); //  목록 새로고침
              alert.showAlert('리뷰가 수정되었습니다.');
            }}
          />
        </div>
      );
    }
  }

  return wrappedComponent;
}
