import React, { Component } from 'react';
import css from './SellerReviewItems.module.scss';
import _ from 'lodash';
import StarItem from '../StarItem';
import moment from 'moment';
import { dateFormat, loginStatus } from 'childs/lib/constant';
import { inject, observer } from 'mobx-react';
import { pushRoute, sendBackToLogin } from 'childs/lib/router';
import isTruthy from 'childs/lib/common/isTruthy';
import cn from 'classnames';
import ReviewReply from 'components/productdetail/ReviewReply';
import ReportModal from 'components/claim/report/ReportModal';
import reportTarget from 'childs/lib/constant/reportTarget';
import Link from 'next/link';
@inject('sellerReview', 'login', 'alert', 'searchitem')
@observer
class SellerReviewItems extends Component {
  state = {
    reviewReply: false,
    isReportModalOpen: false,
  };

  handleReviewReply = () => {
    this.setState({
      reviewReply: !this.state.reviewReply,
    });
  };

  handleReportModal = () => {
    this.setState({
      isReportModalOpen: true,
    });
  };

  handleCloseReportModal = () => {
    this.setState({
      isReportModalOpen: false,
    });
  };

  render() {
    const { review: item, sellerReview, login, searchitem } = this.props;
    const { reviewBookMarks } = sellerReview;
    let checkBookmarks = false;
    if (login.loginStatus === 'LOGIN_DONE') {
      checkBookmarks =
        _.isNil(reviewBookMarks) === false &&
        reviewBookMarks.find(bookmark => {
          return bookmark.targetId === item.review.id;
        });
    }

    // 출시 후 수정 필요
    let renderUserSize;

    if (_.isNil(item.userSize) === false) {
      renderUserSize = '';
      if (
        _.isNil(item.userSize.height) === false &&
        _.isNil(item.userSize.weight) === false
      ) {
        renderUserSize = (
          <div className={css.profileSize}>
            {`키 : ${item.userSize.height}cm, 몸무게 : ${
              item.userSize.weight
            }kg`}
          </div>
        );
      } else if (_.isNil(item.userSize.height) === false) {
        renderUserSize = (
          <div className={css.profileSize}>
            {`키 : ${item.userSize.height}cm`}
          </div>
        );
      } else if (_.isNil(item.userSize.weight) === false) {
        renderUserSize = (
          <div className={css.profileSize}>
            {`몸무게 : ${item.userSize.weight}kg`}
          </div>
        );
      }
    }

    let renderProductoption;

    if (_.isNil(item.productOption) === false) {
      renderProductoption = '';
      if (
        isTruthy(item.productOption.color) &&
        isTruthy(item.productOption.size)
      ) {
        renderProductoption = `구매옵션 : ${item.productOption.color}, ${
          item.productOption.size
        }`;
      } else if (isTruthy(item.productOption.color)) {
        renderProductoption = `구매옵션 : ${item.productOption.color}`;
      } else if (isTruthy(item.productOption.size)) {
        renderProductoption = `구매옵션 : ${item.productOption.size}`;
      }
    }
    return (
      <div className={css.wrap}>
        <div className={css.profileWrap}>
          <div>
            <div className={cn(css.levelWrap, css.fullWidth)}>
              <div
                className={css.brand}
                onClick={() => {
                  searchitem.toSearch({
                    brand: item.review.brandId,
                    enter: 'brand',
                  });
                }}
              >
                {item.review.brandName}
              </div>
              <div className={css.line} />
              <div className={css.title}>
                <Link href={`/productdetail?deals=${item.review.dealId}`}>
                  {item.review.dealName}
                </Link>
              </div>
            </div>
            <div className={css.levelWrap}>
              <div>{StarItem(item.review.productRating)}</div>
              {!_.isNil(item.productOption) ? (
                <div className={cn(css.profileSize, css.option)}>
                  {renderProductoption}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className={css.sizeWrap}>
          <div className={css.itemWrap}>
            <div>{item.reviewQuestions[0].type || '사이즈'}</div>
            <div className={css.line} />
            <div className={css.colored}>{item.reviewTexts.size}</div>
          </div>
          <div className={css.itemWrap}>
            <div>{item.reviewQuestions[1].type || '컬러'}</div>
            <div className={css.line} />
            <div className={css.colored}>{item.reviewTexts.color}</div>
          </div>
          <div className={css.itemWrap}>
            <div>{item.reviewQuestions[2].type || '길이감'}</div>
            <div className={css.line} />
            <div className={css.colored}>{item.reviewTexts.length}</div>
          </div>
        </div>
        <div className={css.profileWrap}>
          <div className={css.levelWrap}>
            <div className={css.userNickname}>{item.review.userNickname}</div>
            {/* 유저 사이즈 */}
            {renderUserSize}
          </div>
        </div>
        <div className={css.contentWrap}>{item.review.textReview}</div>
        <div className={css.dateWithReportWrap}>
          <div className={css.dateWrap}>
            {moment(item.review.createdAtTimestamp).format(
              dateFormat.YYYYMMDD_UI
            )}
            {` `}
            {moment(item.review.createdAtTimestamp).format(dateFormat.HHMM)}
          </div>
          <div
            className={css.reportButton}
            onClick={() => {
              this.handleReportModal();
            }}
          >
            신고
          </div>
        </div>

        <div className={css.imageWrap}>
          {!_.isNil(item.reviewPhotos) ? (
            <div>
              <img
                className={css.reviewPhotos}
                src={`${item.reviewPhotos[0].reviewPhotoUrl + '?w=375'}`}
                alt={`reviewPhoto`}
              />
            </div>
          ) : null}
        </div>
        <div className={css.likeCommentWrap}>
          {login.loginStatus === loginStatus.LOGIN_DONE ? (
            _.isNil(checkBookmarks) === true ? (
              <div
                className={css.likeWrap}
                onClick={() => {
                  sellerReview.setProductReviewBookmarks(item.review.id);
                  item.review.bookmarkCount++;
                }}
              >
                <div>도움되었어요</div>
                <div className={css.likeIcon} />
                <div className={css.bookmarkCount}>{`${
                  item.review.bookmarkCount
                }`}</div>
              </div>
            ) : (
              <div
                className={css.likeWrap}
                onClick={() => {
                  sellerReview.delProductReviewBookmarks(item.review.id);
                  item.review.bookmarkCount--;
                }}
              >
                <div>도움되었어요</div>
                <div className={css.unLikeIcon} />
                <div className={css.bookmarkCount}>{`${
                  item.review.bookmarkCount
                }`}</div>
              </div>
            )
          ) : (
            <div className={css.likeWrap} onClick={() => sendBackToLogin()}>
              <div>도움되었어요</div>
              <div className={css.likeIcon} />
              <div className={css.bookmarkCount}>{`${
                item.review.bookmarkCount
              }`}</div>
            </div>
          )}

          <div className={css.commentWrap}>
            {/* <div>{`-댓글 6개`}</div> */}
            {/* <div className={css.line} /> */}
            {/* <div></div>신고</div> */}
          </div>
          {item.review.replied ? (
            <div
              className={css.commentWrap}
              onClick={() => {
                this.handleReviewReply();
              }}
            >
              <div
                className={this.state.reviewReply ? css.replyOn : css.replyOff}
              >
                셀러 댓글 1
              </div>
              <div
                className={css.arrow}
                style={
                  this.state.reviewReply
                    ? {
                        backgroundImage: `url('/static/icon/detail-icon-down-color@3x.png')`,
                      }
                    : {
                        backgroundImage: `url('/static/icon/detail-icon-arrow-open@3x.png')`,
                      }
                }
              />
            </div>
          ) : null}
        </div>
        {item.review.replied && this.state.reviewReply ? (
          <ReviewReply
            reviewItem={item}
            key={item.review.id}
            wrapStyle={{ marginTop: '16px' }}
          />
        ) : null}

        {/* 신고 모달 */}
        <ReportModal
          isOpen={this.state.isReportModalOpen}
          onClose={this.handleCloseReportModal}
          reportData={{
            reportTarget: reportTarget.REVIEW,
            targetId: item.review.id,
          }}
          relatedData={[
            {
              label: '상품',
              value: item.review.dealName,
            },
            {
              label: '리뷰 내용',
              value: item.review.textReview,
            },
            {
              label: '작성자',
              value: item.review.userNickname,
            },
          ]}
        />
      </div>
    );
  }
}

export default SellerReviewItems;
