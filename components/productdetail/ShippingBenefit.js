import React, { Component } from 'react';
import css from './ShippingBenefit.module.scss';
import StarItem from './StarItem';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import cn from 'classnames';
import { pushRoute, sendBackToLogin } from 'childs/lib/router';
import { loginStatus } from 'childs/lib/constant';
import CardInterestModal from 'components/common/modal/CardInterestModal';
@inject(
  'productreview',
  'productoption',
  'productdetail',
  'sellerfollow',
  'login',
  'alert',
  'cardinterest',
  'login'
)
@observer
class ShippingBenefit extends Component {
  state = {
    benefitHandle: true,
  };
  benefitHandler = () => {
    this.setState({
      benefitHandle: !this.state.benefitHandle,
    });
  };

  handleSellerFollows = () => {
    const { sellerfollow, productdetail, login } = this.props;
    const follows = sellerfollow.follows;
    if (login.isLoggedIn) {
      if (follows === false) {
        sellerfollow.setSellerFollow(productdetail.deals.sellerId);
      } else if (follows === true) {
        sellerfollow.deleteSellerFollow(productdetail.deals.sellerId);
      }
    } else {
      sendBackToLogin();
    }
  };
  componentWillUnmount() {
    this.props.cardinterest.closeCardInterest();
  }
  render() {
    const {
      deals,
      satisfaction,
      seller,
      productreview,
      tabRefMap,
      productoption,
      sellerfollow,
      login,
      alert,
      sellerStore,
      cardinterest,
    } = this.props;
    const { reviewSummary } = productreview;
    return (
      <div className={css.wrap}>
        <div
          className={css.itemWrap}
          style={{ borderBottom: '1px solid #eee' }}
        >
          <div className={css.itemTitle}>배송정보</div>
          <div className={css.contentsWrap}>
            <div>{deals.shippingSummary}</div>
          </div>
        </div>
        <div
          className={css.itemWrap}
          onClick={() => {
            this.benefitHandler();
          }}
          style={
            this.state.benefitHandle
              ? { borderBottom: 'none' }
              : { borderBottom: '1px solid #eee' }
          }
        >
          <div className={css.itemTitle}>혜택정보</div>
          <div className={css.contentsWrap}>
            {productoption.duesavePointList?.length > 0 ? (
              <div>포인트 적립</div>
            ) : null}

            {/* 무이자혜택 */}
            <div>무이자 할부</div>

            {/* 카드추가혜택 */}
            {false ? <div>카드추가혜택</div> : null}
          </div>
          <div
            className={css.plusIcon}
            style={
              this.state.benefitHandle
                ? {
                    backgroundImage: 'url("/static/icon/minus_icon_m.png")',
                  }
                : {
                    backgroundImage: 'url("/static/icon/plus_icon_m.png")',
                  }
            }
          />
        </div>

        {this.state.benefitHandle ? (
          <div className={css.benefitDetailWrap}>
            {productoption.duesavePointList?.length > 0 ? (
              <div className={css.benefitDetailSection}>
                <div className={css.benefitDetaieTitle}>포인트 적립</div>
                <div className={css.benefitDetailContent}>
                  {productoption.duesavePointList.map((data, index) => {
                    return (
                      <div key={index}>
                        {data.dueSaveType === 'BUY'
                          ? `구매 확정 시 ${data.totalPoint?.toLocaleString()}P 적립`
                          : data.dueSaveType === 'REVIEW'
                          ? `리뷰 작성 시 최대 ${data.totalPoint?.toLocaleString()}P 적립`
                          : data.dueSaveType === 'FIRST_ORDER'
                          ? `첫 구매 시 ${data.totalPoint?.toLocaleString()}P 적립`
                          : `구매 시 ${data.totalPoint?.toLocaleString()}P 적립`}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* 무이자혜택 */}

            <div className={css.benefitDetailSection}>
              <div className={css.benefitDetaieTitle}>무이자 할부</div>
              <div className={css.benefitDetailContent}>5만원 이상 무이자</div>
              <div
                className={css.interestDetailButton}
                onClick={() => {
                  cardinterest.getCardInterest();
                }}
              >
                자세히보기
              </div>
            </div>

            {/* 제휴카드 혜택 */}
            {false ? (
              <div className={css.benefitDetailSection}>
                <div className={css.benefitDetaieTitle}>카드추가혜택</div>
                <div className={css.benefitDetailContent}>
                  제휴카드 결제 시 최대 12% 할인
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          className={css.sellerWrap}
          onClick={() => pushRoute(`/store/${sellerStore.nickname}`)}
        >
          <div
            className={css.profile}
            style={
              _.isNil(seller) !== true &&
              seller.user.profileImageUrl !== '' &&
              seller.user.profileImageUrl !== null
                ? {
                    backgroundImage: `url(${seller.user.profileImageUrl})`,
                  }
                : null
            }
          />
          <div>
            <div>
              <div className={css.infoTop}>
                <div className={css.sellerName}>{deals.sellerName}</div>
                <div>
                  {/* 회원등급 제거 : 추후 추가 예정 */}
                  {/* <div className={css.levelWrap}>
                    <div>1</div>
                  </div>
                  <div className={css.sellerGrade}>*파워셀러</div> */}
                </div>
              </div>
              <div className={css.infoWrap}>
                {login.loginStatus === loginStatus.LOGIN_DONE ? (
                  <button
                    className={cn({
                      [css.colored]: sellerfollow.follows === true,
                    })}
                    onClick={e => {
                      this.handleSellerFollows();
                      e.stopPropagation();
                    }}
                  >
                    {sellerfollow.follows === false ? '팔로우' : '팔로잉'}
                  </button>
                ) : (
                  <button
                    className={cn()}
                    onClick={e => {
                      sendBackToLogin();
                      e.stopPropagation();
                    }}
                  >
                    {'팔로우'}
                  </button>
                )}
                <button>셀러스토어</button>
              </div>
            </div>
            <div className={css.satisfaction}>
              <div className={css.good}>
                만족 {satisfaction ? satisfaction.good : null}명
              </div>
              <div className={css.usual}>
                보통 {satisfaction ? satisfaction.normal : null}명
              </div>
              <div className={css.bad}>
                불만족 {satisfaction ? satisfaction.bad : null}명
              </div>
            </div>
          </div>
        </div>
        {_.isNil(reviewSummary) === false && (
          <div className={css.itemWrap}>
            <div className={css.itemTitle}>상품리뷰</div>
            <div className={css.contentsWrap}>
              <div className={css.itemContents}>
                {StarItem(reviewSummary.averageReviewsRating, true)}
                <div className={css.averageReviewsRating}>
                  {`${reviewSummary.averageReviewsRating}`}
                </div>
              </div>

              <div className={css.itemContents}>
                {`${reviewSummary.totalReviewsCount}건`}
                <div
                  className={css.arrowR}
                  onClick={() =>
                    window.scrollTo(
                      0,
                      tabRefMap.reviewTab.current.offsetTop - 180
                    )
                  }
                />
              </div>
            </div>
          </div>
        )}
        <CardInterestModal
          isVisible={cardinterest.cardInterestIsOpen}
          onClose={() => {
            cardinterest.closeCardInterest();
          }}
        />
      </div>
    );
  }
}

export default ShippingBenefit;
