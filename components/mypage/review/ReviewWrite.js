import { Component } from 'react';
import ReviewWriteItem from './ReviewWriteItem';
import MypageDataEmpty from '../MypageDataEmpty';
import { inject, observer } from 'mobx-react';
import css from './ReviewWriteItem.module.scss';

/**
 * 작성 가능한 리뷰
 */
@inject(
  'orderCompleteList',
  'mypagereview',
  'mypagePoint',
  'mypageDashboard',
  'alert',
  'searchitem'
)
@observer
class ReviewWrite extends Component {
  state = { isModalOpen: false, modalData: {}, initialPage: 1 };

  listTop = 'listTop';

  handleClickWriteReviewButton = (orderItem) => {
    this.props.orderCompleteList.handleClickWriteReviewButton(orderItem);
  };

  handleChangePage = (page) => {
    const { mypagereview: mypageReviewStore } = this.props;

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
    const {
      mypagereview: mypageReviewStore,
      searchitem: searchItemStore,
    } = this.props;
    const {
      availableReview,
      orderItemList,
      availableReviewPage,
    } = mypageReviewStore;

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
                  onSearch={searchItemStore.toSearch}
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
      </>
    );
  }
}

export default ReviewWrite;
