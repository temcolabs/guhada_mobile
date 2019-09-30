import React, { Component, Fragment } from 'react';
import css from './ProductInquiry.module.scss';
import cn from 'classnames';
import InquiryItem from './InquiryItem';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import NewInquiry from './NewInquiry';
import _ from 'lodash';
import { loginStatus } from 'constant/';

@inject('productdetail', 'login', 'alert')
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
  };

  render() {
    const { productdetail, login, tabRefMap, alert } = this.props;
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
                    alert.showAlert('로그인이 필요한 서비스입니다.');
                  }}
                />
              )}
              <label htmlFor="askCheckbox">
                <span />내 문의만 보기
              </label>
            </div>
          </div>
          <div>
            <button
              className={css.isColored}
              onClick={() =>
                login.loginStatus === loginStatus.LOGIN_DONE
                  ? this.setIsNewInquiryVisible(true)
                  : alert.showAlert('로그인이 필요한 서비스입니다.')
              }
            >
              상품 문의하기
            </button>
            <button
              onClick={() =>
                alert.showAlert({ content: '모바일 버전 준비중입니다.' })
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
              전체문의
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
              답변완료
            </div>
            <div
              className={cn(css.tabItem, {
                [css.selectTab]: this.state.tab === 'PENDING',
              })}
              onClick={() => (
                this.setTab('PENDING'), productdetail.getInquiry(0, 'PENDING')
              )}
            >
              미답변
            </div>
          </div>
        </div>
        <div>
          {inquiryList.content ? (
            inquiryList.content.map(inquiry => {
              return <InquiryItem inquiry={inquiry} key={inquiry.id} />;
            })
          ) : (
            <div className={css.empty}>작성된 상품 문의가 없습니다.</div>
          )}
        </div>
        {/* {_.isNil(inquiryList.content) === false ?
        (inquiryList.last === false || inquiryList.first === true) && (
          <div
            className={css.pageButton}
            onClick={() => productdetail.addInquiry(this.state.tab)}
          >
            상품 문의 더보기 +
          </div>
        ) : null} */}

        {_.isNil(inquiryList.content) === false && handleInquiryIcon === false && (
          <div
            className={css.pageButton}
            onClick={() => productdetail.addInquiry(this.state.tab)}
          >
            상품 문의 더보기 +
          </div>
        )}

        <NewInquiry
          isVisible={this.state.isNewInquiryVisible}
          onClose={() => this.setIsNewInquiryVisible(false)}
        />
      </div>
    );
  }
}

export default ProductInquiry;
