import React, { Component } from 'react';
import css from './ProductInquiry.module.scss';
import cn from 'classnames';
import InquiryItem from './InquiryItem';
import { inject, observer } from 'mobx-react';
import NewInquiry from './NewInquiry';
import SellerClaimModal from 'components/claim/sellerclaim/SellerClaimModal';
import _ from 'lodash';
import { loginStatus } from 'childs/lib/constant';
import { sendBackToLogin } from 'childs/lib/router';

@inject('productdetail', 'login', 'alert', 'sellerClaim')
@observer
class ProductInquiry extends Component {
  state = {
    tab: '',
    isNewInquiryVisible: false,
    isSellerClaimVisible: false,
  };

  componentWillUnmount() {
    this.props.sellerClaim.resetSellerClaimData();
  }

  setTab = tab => {
    this.setState({ tab });
  };

  setIsNewInquiryVisible = isNewInquiryVisible => {
    this.setState({ isNewInquiryVisible: isNewInquiryVisible });
  };

  getIsSellerClaimVisible = sellerId => {
    this.props.sellerClaim.checkIsSellerClaimPossible({
      sellerId,
      whenPossible: () => {
        this.setState({ isSellerClaimVisible: true });
      },
      whenImpossible: () => {
        this.props.alert.showConfirm({
          content:
            '해당 판매자에게 주문한 기록을 찾을 수 없습니다. 상품 문의를 통해서만 문의가 가능합니다.',
          cancelText: '취소',
          confirmText: '상품 문의하기',
          onConfirm: () => {
            this.setState({ isNewInquiryVisible: true });
          },
        });
      },
    });
  };

  setIsSellerClaimModalVisible = isVisible => {
    this.setState({ isSellerClaimVisible: isVisible });
  };

  render() {
    const { productdetail, login, tabRefMap, sellerClaim } = this.props;
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
            <button
              onClick={() =>
                this.getIsSellerClaimVisible({ sellerId: deals.sellerId })
              }
            >
              판매자 문의하기
            </button>
          </div>
          <div className={css.desc}>
            구매하시려는 상품에 대해 궁금하신 점이 있으신 경우, 문의해주세요.
            {/* 상품 이외의 문의는 ‘판매자 문의하기’를 이용해주세요. */}
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
                [css.selectTab]: this.state.tab === 'COMPLETED',
              })}
              onClick={() => (
                this.setTab('COMPLETED'),
                productdetail.getInquiry(0, 'COMPLETED')
              )}
            >
              <div className={css.betweenTab}>답변완료</div>
            </div>
            <div
              className={cn(css.tabItem, {
                [css.selectTab]: this.state.tab === 'PENDING',
              })}
              onClick={() => {
                this.setTab('PENDING');
                productdetail.getInquiry(0, 'PENDING');
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

        {/* 판매나 주의 */}
        <SellerClaimModal
          sellerId={deals?.sellerId}
          isOpen={this.state.isSellerClaimVisible && sellerClaim.isPossible}
          onClose={() => this.setIsSellerClaimModalVisible(false)}
        />
      </div>
    );
  }
}

export default ProductInquiry;
