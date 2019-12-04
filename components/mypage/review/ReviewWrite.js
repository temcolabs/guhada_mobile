import React, { Component } from 'react';
import ReviewWriteItem from './ReviewWriteItem';
import Pagination from 'components/common/Pagination';
import ReviewWriteModal, { reviewModalType } from './ReviewWriteModal';
import MypageDataEmpty from '../MypageDataEmpty';
import { inject, observer } from 'mobx-react';
import { scrollToTarget } from 'childs/lib/common/scroll';
import { devLog } from 'childs/lib/common/devLog';
import css from './ReviewWriteItem.module.scss';

/**
 * 작성 가능한 리뷰
 */
@inject('mypagereview', 'mypagePoint', 'mypageDashboard', 'alert')
@observer
class ReviewWrite extends Component {
  state = { isModalOpen: false, modalData: {}, initialPage: 1 };

  listTop = 'listTop';

  handleClickWriteReviewButton = orderItem => {
    this.setState({
      isModalOpen: true,
      modalData: orderItem,
    });
  };

  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  handleChangePage = page => {
    const { mypagereview: mypageReviewStore } = this.props;

    // scrollToTarget({ id: this.listTop, behavior: 'auto' });
    mypageReviewStore.availableReviewPage += 1;
    mypageReviewStore.getAvailableReview(mypageReviewStore.availableReviewPage);
  };

  handleSubmitReview = ({ data } = {}) => {
    const {
      mypagereview: mypageReviewStore,
      mypagePoint: mypagePointStore,
    } = this.props;
    mypageReviewStore.getAvailableReview();
    mypageReviewStore.getMyReviews();
    mypageReviewStore.initReviewPhotos();
    this.handleModalClose();

    // 포인트 적립 알림 모달 열기 모달
    const { savedPointResponse } = data;

    if (savedPointResponse) {
      // 포인트 적립 모달 열기
      mypagePointStore.openPointSavingModal(savedPointResponse);
    } else {
      this.props.alert.showAlert('리뷰가 등록되었습니다.');
    }
  };

  render() {
    const { mypagereview: mypageReviewStore } = this.props;
    const {
      availableReview,
      orderItemList,
      availableReviewPage,
    } = mypageReviewStore;
    devLog(`availableReview`, availableReview);

    return (
      <>
        <div id={this.listTop}>
          {orderItemList === undefined ? (
            <MypageDataEmpty text="작성 가능한 리뷰가 없습니다." />
          ) : orderItemList?.length > 0 ? (
            orderItemList.map((item, index) => {
              return (
                <ReviewWriteItem
                  onClickReviewButton={this.handleClickWriteReviewButton}
                  orderItem={item}
                  key={index}
                />
              );
            })
          ) : (
            <MypageDataEmpty text="작성 가능한 리뷰가 없습니다." />
          )}
        </div>

        {mypageReviewStore.availableReview?.page !==
          mypageReviewStore.availableReview?.totalPage && (
          <div
            className={css.moreBtn}
            onClick={() => this.handleChangePage(availableReviewPage)}
          >
            더 보기
          </div>
        )}

        {/* 리뷰 작성 모달 */}
        {/* <ReviewWriteModal
          isOpen={this.state.isModalOpen}
          handleModalClose={this.handleModalClose}
          modalData={this.state.modalData}
          status={reviewModalType.WRITE}
          onSuccessSubmit={this.handleSubmitReview}
        /> */}
      </>
    );
  }
}

export default ReviewWrite;
