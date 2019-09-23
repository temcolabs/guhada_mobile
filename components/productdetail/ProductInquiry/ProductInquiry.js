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
    const { deals, inquiryList } = productdetail;
    return (
      <div className={css.wrap} ref={tabRefMap.inquiryTab}>
        <div className={css.headerWrap}>
          <div className={css.header}>
            상품문의{` `}
            {_.isNil(inquiryList.data)
              ? 0
              : String(inquiryList.totalElements).toLocaleString()}
            건
            {login.loginStatus === 'LOGIN_DONE' ? (
              <div className={css.myinquiry}>
                <input
                  type="checkbox"
                  id="askCheckbox"
                  onChange={e =>
                    e.target.checked
                      ? productdetail.getInquiry(0, '', true)
                      : productdetail.getInquiry(0, '', false)
                  }
                />
                <label htmlFor="askCheckbox">
                  <span />내 문의만 보기
                </label>
              </div>
            ) : null}
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
            <button>판매자 문의하기</button>
          </div>
          <div className={css.desc}>
            구매하시려는 상품에 대해 궁금하신 점이 있으신 경우, 문의해주세요.
            상품 이외의 문의는 ‘판매자 문의하기’를 이용해주세요.
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
        {inquiryList.content !== undefined && inquiryList.last === false ? (
          <div
            className={css.pageButton}
            onClick={() => productdetail.addInquiry(this.state.tab)}
          >
            상품 문의 10개 더보기 +
          </div>
        ) : null}

        <NewInquiry
          isVisible={this.state.isNewInquiryVisible}
          onClose={() => this.setIsNewInquiryVisible(false)}
        />
      </div>
    );
  }
}

export default ProductInquiry;
