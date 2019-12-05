import React, { Component } from 'react';
// import OrderPeriodSelector from '../order/OrderPeriodSelector';
import ReviewModifyItem from './ReviewModifyItem';
import Pagination from 'components/common/Pagination';
import { observer, inject } from 'mobx-react';
import ReviewWriteModal, { reviewModalType } from './ReviewWriteModal';
import ReviewDeleteModal from './ReviewDeleteModal';
import MypageDataEmpty from '../MypageDataEmpty';
import { toJS } from 'mobx';
import { scrollToTarget } from 'childs/lib/common/scroll';
import { devLog } from 'childs/lib/common/devLog';
import _ from 'lodash';
import css from './ReviewModifyItem.module.scss';

/**
 * 내가 작성한 리뷰
 */
@inject('mypagereview')
@observer
class ReviewModify extends Component {
  state = {
    isModalOpen: false,
    modalData: {},
    reviewData: {},
    isDeleteModalOpen: false,
  };

  listTop = 'listTop';

  handleClickWriteReviewButton = (orderItem, reivewItem) => {
    this.setState({
      isModalOpen: true,
      modalData: orderItem,
      reviewData: reivewItem,
    });
  };

  handleClickDeleteReviewButton = reivewItem => {
    this.setState({
      isDeleteModalOpen: true,
      reviewData: reivewItem,
    });
  };

  handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  handleDeleteModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  };

  handleChangePage = page => {
    scrollToTarget({ id: this.listTop, behavior: 'auto' });
    this.props.mypagereview.getMyReviews(page);
  };

  render() {
    const { mypagereview: mypageReviewStore } = this.props;
    const { myReviews } = mypageReviewStore;
    devLog(`toJs(myReviews)`, toJS(myReviews));

    return (
      <>
        {/* TODO:  */}
        {/* <OrderPeriodSelector /> */}
        <div id={this.listTop}>
          {!_.isNil(myReviews.content) ? (
            myReviews.content?.map((review, index) => {
              return (
                <ReviewModifyItem
                  onClickReviewButton={this.handleClickWriteReviewButton}
                  onClickDeleteButton={this.handleClickDeleteReviewButton}
                  productReview={review}
                  key={index}
                />
              );
            })
          ) : (
            <MypageDataEmpty text="내가 작성한 리뷰가 없습니다." />
          )}
        </div>

        <div
          className={css.moreBtn}
          // onClick={() => this.handleChangePage(availableReviewPage)}
        >
          더 보기
        </div>
        {/* 
        <Pagination
          initialPage={myReviews.pageable?.pageNumber + 1 || 1}
          onChangePage={this.handleChangePage}
          itemsCountPerPage={mypageReviewStore.myReviewsPageSize || 1}
          totalItemsCount={myReviews.totalElements || 1}
        /> */}

        {/* 리뷰 수정 모달 */}
        {/* <ReviewWriteModal
          isOpen={this.state.isModalOpen}
          handleModalClose={this.handleModalClose}
          modalData={this.state.modalData}
          reviewData={this.state.reviewData}
          status={reviewModalType.MODIFY}
          onSuccessModify={() => {
            this.handleModalClose();
            mypageReviewStore.initReviewPhotos();
            mypageReviewStore.getMyReviews();
            mypageReviewStore.getAvailableReview();
            mypageReviewStore.initReviewPhotos();
          }}
        /> */}

        <ReviewDeleteModal
          isDeleteOpen={this.state.isDeleteModalOpen}
          handleDeleteModalClose={this.handleDeleteModalClose}
          modalData={this.state.modalData}
          reviewData={this.state.reviewData}
        />
      </>
    );
  }
}
export default ReviewModify;
