import React, { Component } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';
import { inject, observer } from 'mobx-react';
import MypageReviewHeading from 'components/mypage/review/MypageReviewHeading';
import ReviewWrite from 'components/mypage/review/ReviewWrite';
import ReviewModify from 'components/mypage/review/ReviewModify';
import withReviewModal from 'components/mypage/review/withReviewModal';

@withReviewModal
@inject('mypagereview', 'mypagePoint', 'productreview')
@observer
class MyReviewList extends Component {
  // write, modify
  state = {
    selection: 'write',
  };

  setSelection = (selection) => {
    this.setState({
      selection: selection,
    });
  };

  componentDidMount() {
    const { mypagereview, productreview } = this.props;
    mypagereview.getAvailableReview(1); // 작성 가능한 리뷰
    mypagereview.getMyReviews(); // 작성한 리뷰

    productreview.getProductReviewPoint();
  }

  componentWillUnmount() {
    const { mypagereview, productreview } = this.props;
    if (mypagereview) mypagereview.initialize();
  }

  render() {
    const { mypagereview } = this.props;

    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'나의리뷰'}
        headerShape={'mypageDetail'}
      >
        <MypageReviewHeading
          setSelection={this.setSelection}
          selection={this.state.selection}
          availableReviewCount={mypagereview.availableReview?.count || 0}
          reviewCount={mypagereview.myReviews?.totalElements || 0}
        />
        {this.state.selection === 'write' ? (
          // 작성 가능한 리뷰
          <ReviewWrite />
        ) : (
          // 내가 작성한 리뷰
          <ReviewModify />
        )}
      </MypageLayout>
    );
  }
}

export default MyReviewList;
