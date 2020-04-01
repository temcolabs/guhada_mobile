import React, { Component } from 'react';
import css from './ProductInquiry.module.scss';
import cn from 'classnames';
import InquiryItem from './InquiryItem';
import { inject, observer } from 'mobx-react';
import NewInquiry from './NewInquiry';
import SellerClaimModal, {
  withSellerClaimModal,
} from 'components/claim/sellerclaim/SellerClaimModal';
import _ from 'lodash';
import { loginStatus } from 'childs/lib/constant';
import { sendBackToLogin } from 'childs/lib/router';
import inquiryStatus from 'childs/lib/constant/inquiry/inquiryStatus';

@withSellerClaimModal
@inject('productdetail', 'login', 'alert', 'sellerClaim')
@observer
class ProductInquiry extends Component {
  state = {
    tab: '',
    isNewInquiryVisible: false,
  };

  setTab = tab => {
    this.setState({ tab });
  };

  setIsNewInquiryVisible = isNewInquiryVisible => {
    this.setState({ isNewInquiryVisible: isNewInquiryVisible });
    this.props.isNewInquiryVisible(isNewInquiryVisible);
  };

  render() {
    const { productdetail, login, tabRefMap } = this.props;
    const { deals, inquiryList, inquiryPage } = productdetail;
    let handleInquiryIcon =
      inquiryList.totalPages === inquiryPage + 1 ? true : false;

    return (
      <div className={css.wrap} ref={tabRefMap.inquiryTab}>
        <div className={css.headerWrap}>
          <div className={css.header}>
            상품문의{` `}
            {_.isNil(inquiryList.content) === false
              ? String(inquiryList.totalElements).toLocaleString()
              : 0}
            건
            <div className={css.myinquiry}>
              {login.loginStatus === loginStatus.LOGIN_DONE ? (
                <input
                  type="checkbox"
                  id="askCheckbox"
                  onChange={e =>
                    e.target.checked
                      ? productdetail.getInquiry(0, '', true)
                      : productdetail.getInquiry(0, '', false)
                  }
                />
              ) : (
                <input
                  type="checkbox"
                  id="askCheckbox"
                  onClick={e => {
                    e.preventDefault();
                    sendBackToLogin();
                  }}
                />
              )}
              <label htmlFor="askCheckbox">내 문의만 보기</label>
            </div>
          </div>
          <div>
            <button
              className={css.isColored}
              onClick={() =>
                login.loginStatus === loginStatus.LOGIN_DONE
                  ? this.setIsNewInquiryVisible(true)
                  : sendBackToLogin()
              }
            >
              상품 문의하기
            </button>
          </div>
          <div className={css.desc}>
            구매하시려는 상품에 대해 궁금하신 점이 있으신 경우, 문의해주세요.
          </div>
          <div className={css.tabWrap}>
            <div
              className={cn(css.tabItem, {
                [css.selectTab]: this.state.tab === '',
              })}
              onClick={() => (this.setTab(''), productdetail.getInquiry(0, ''))}
            >
              <div className={css.betweenTab}>전체문의</div>
            </div>
            <div
              className={cn(css.tabItem, {
                [css.selectTab]: this.state.tab === inquiryStatus.COMPLETED,
              })}
              onClick={() => {
                this.setTab(inquiryStatus.COMPLETED);
                productdetail.getInquiry(0, inquiryStatus.COMPLETED);
              }}
            >
              <div className={css.betweenTab}>답변완료</div>
            </div>
            <div
              className={cn(css.tabItem, {
                [css.selectTab]: this.state.tab === inquiryStatus.PENDING,
              })}
              onClick={() => {
                this.setTab(inquiryStatus.PENDING);
                productdetail.getInquiry(0, inquiryStatus.PENDING);
              }}
            >
              <div className={css.betweenTab}>미답변</div>
            </div>
          </div>
        </div>
        <div>
          {inquiryList.content ? (
            inquiryList.content.map(inquiry => {
              return <InquiryItem inquiry={inquiry} key={inquiry.id} />;
            })
          ) : (
            <div className={css.empty}>
              <div className={css.emptyText}>작성된 상품 문의가 없습니다.</div>
            </div>
          )}
        </div>
        {_.isNil(inquiryList.content) === false && handleInquiryIcon === false && (
          <div
            className={css.pageButton}
            onClick={() => productdetail.addInquiry(this.state.tab)}
          >
            상품 문의 더보기
            <div className={css.plusIcon} />
          </div>
        )}

        {/* 상품 문의 */}
        <NewInquiry
          isVisible={this.state.isNewInquiryVisible}
          onClose={() => this.setIsNewInquiryVisible(false)}
        />

        {/* 판매자 문의하기 모달 */}
        {/* <SellerClaimModal
          isOpen={this.props.isSellerClaimModalOpen}
          sellerId={this.props.sellerIdToClaim}
          onClose={this.props.handleCloseSellerClaimModal}
        /> */}
      </div>
    );
  }
}

export default ProductInquiry;
