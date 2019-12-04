import React, { Component } from 'react';
import MypageLayout from 'components/mypage/MypageLayout';
import { inject, observer } from 'mobx-react';
import MypageReviewHeading from 'components/mypage/review/MypageReviewHeading';
import MypageDataEmpty from 'components/mypage/MypageDataEmpty';

@inject('mypagereview', 'mypagePoint')
@observer
class MyReviewList extends Component {
  // write, modify
  state = {
    selection: 'write',
  };

  setSelection = selection => {
    this.setState({
      selection: selection,
    });
  };

  componentDidMount() {
    const { mypagereview } = this.props;
    mypagereview.getAvailableReview(1); // 작성 가능한 리뷰
    mypagereview.getMyReviews(); // 작성한 리뷰
  }

  render() {
    const { mypagereview, mypagePoint: mypagePointStore } = this.props;

    return (
      <MypageLayout
        topLayout={'main'}
        pageTitle={'마이페이지'}
        headerShape={'mypage'}
      >
        <MypageReviewHeading
          setSelection={this.setSelection}
          selection={this.state.selection}
          availableReviewCount={mypagereview.availableReview?.count || 0}
          reviewCount={mypagereview.myReviews?.totalElements || 0}
        />
        <MypageDataEmpty text={`작성 가능한 리뷰가 없습니다.`} />
      </MypageLayout>
    );
  }
}

export default MyReviewList;
