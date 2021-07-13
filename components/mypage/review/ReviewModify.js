import { Component } from 'react';
import ReviewModifyItem from './ReviewModifyItem';
import { observer, inject } from 'mobx-react';
import ReviewDeleteModal from './ReviewDeleteModal';
import MypageDataEmpty from '../MypageDataEmpty';
import { toJS } from 'mobx';
import { devLog } from 'lib/common/devLog';
import css from './ReviewModifyItem.module.scss';
import isTruthy from 'lib/common/isTruthy';

/**
 * 내가 작성한 리뷰
 */
@inject('mypagereview', 'orderCompleteList', 'searchitem')
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

  handleClickDeleteReviewButton = (reivewItem) => {
    this.setState({
      isDeleteModalOpen: true,
      reviewData: reivewItem,
    });
  };

  handleDeleteModalClose = () => {
    this.setState({ isDeleteModalOpen: false });
  };

  handleChangePage = (page) => {
    const { mypagereview: mypageReviewStore } = this.props;

    mypageReviewStore.myReviewPage += 1;
    mypageReviewStore.getMyReviews(mypageReviewStore.myReviewPage);
    // scrollToTarget({ id: this.listTop, behavior: 'auto' });
    // this.props.mypagereview.getMyReviews(page);
  };

  render() {
    const {
      mypagereview: mypageReviewStore,
      searchitem: searchItemStore,
    } = this.props;
    const { myReviews, myReviewPage, myReivewsItemList } = mypageReviewStore;
    devLog(`toJs(myReviews)`, toJS(myReviews));

    return (
      <>
        {/* TODO:  */}
        {/* <OrderPeriodSelector /> */}
        <div id={this.listTop}>
          {isTruthy(myReivewsItemList) ? (
            myReivewsItemList.map((review, index) => {
              return (
                <ReviewModifyItem
                  onClickReviewButton={this.handleClickWriteReviewButton}
                  onClickDeleteButton={this.handleClickDeleteReviewButton}
                  productReview={review}
                  onSearch={searchItemStore.toSearch}
                  key={index}
                />
              );
            })
          ) : (
            <MypageDataEmpty text="내가 작성한 리뷰가 없습니다." />
          )}
        </div>
        {/* myReviews */}
        {mypageReviewStore.myReviews?.number + 1 !==
          mypageReviewStore.myReviews?.totalPages && (
          <div
            className={css.moreBtn}
            onClick={() => this.handleChangePage(myReviewPage)}
          >
            더 보기
          </div>
        )}

        {/*
        <Pagination
          initialPage={myReviews.pageable?.pageNumber + 1 || 1}
          onChangePage={this.handleChangePage}
          itemsCountPerPage={mypageReviewStore.myReviewsPageSize || 1}
          totalItemsCount={myReviews.totalElements || 1}
        /> */}

        {this.state.isDeleteModalOpen && (
          <ReviewDeleteModal
            isDeleteOpen={this.state.isDeleteModalOpen}
            handleDeleteModalClose={this.handleDeleteModalClose}
            modalData={this.state.modalData}
            reviewData={this.state.reviewData}
          />
        )}
      </>
    );
  }
}
export default ReviewModify;
