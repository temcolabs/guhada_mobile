import React, { Component } from 'react';
// import OrderPeriodSelector from '../order/OrderPeriodSelector';
import ReviewModifyItem from './ReviewModifyItem';
// import Pagination from 'components/common/Pagination';
import { observer, inject } from 'mobx-react';
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
@inject('mypagereview', 'orderCompleteList')
@observer
class ReviewModify extends Component {
  state = {
    reviewData: {},
    isDeleteModalOpen: false,
  };

  listTop = 'listTop';

  handleClickWriteReviewButton = (orderItem, reivewItem) => {
    this.props.orderCompleteList.handleClickEditReviewButton(orderItem);
  };

  handleClickDeleteReviewButton = reivewItem => {
    this.setState({
      isDeleteModalOpen: true,
      reviewData: reivewItem,
    });
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
