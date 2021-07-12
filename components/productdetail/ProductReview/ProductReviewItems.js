import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import css from './ProductReviewItems.module.scss';
import _ from 'lodash';
import StarItem from '../StarItem';
import moment from 'moment';
import { dateFormat, loginStatus } from 'lib/constant';
import { inject, observer } from 'mobx-react';
import { pushRoute, sendBackToLogin } from 'lib/router';
import isTruthy from 'lib/common/isTruthy';
import cn from 'classnames';
import ReviewReply from 'components/productdetail/ReviewReply';
import ReportModal from 'components/claim/report/ReportModal';
import reportTarget from 'lib/constant/reportTarget';
import { toJS } from 'mobx';

/**
 * 이미지 확대 모달
 * @returns { React.Component } PhotoDetailModal
 */
const PhotoDetailModal = dynamic(() =>
  import('components/organisms/Modals/PhotoDetailModal')
);
@inject('productreview', 'login', 'alert')
@observer
class ProductReviewItems extends Component {
  state = {
    reviewReply: false,
    isReportModalOpen: false,
    isActivePhotoDetail: false,
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

  handleCloseReportModal = () =>
    this.setState({
      isReportModalOpen: false,
    });

  render() {
    const { review: item, productreview, login } = this.props;
    const { reviewBookMarks } = productreview;

    let checkBookmarks = false;
    if (login.loginStatus === 'LOGIN_DONE') {
      checkBookmarks =
        _.isNil(reviewBookMarks) === false &&
        reviewBookMarks.find((bookmark) => {
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
            {`키 : ${item.userSize.height}cm, 몸무게 : ${item.userSize.weight}kg`}
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
        renderProductoption = `구매옵션 : ${item.productOption.color}, ${item.productOption.size}`;
      } else if (isTruthy(item.productOption.color)) {
        renderProductoption = `구매옵션 : ${item.productOption.color}`;
      } else if (isTruthy(item.productOption.size)) {
        renderProductoption = `구매옵션 : ${item.productOption.size}`;
      }
    }
    return (
      <>
        {this.state.isActivePhotoDetail && (
          <PhotoDetailModal
            isOpen={this.state.isActivePhotoDetail}
            photos={toJS(item.reviewPhotos)}
            onClickClose={() => this.setState({ isActivePhotoDetail: false })}
          />
        )}
        <div className={css.wrap}>
          <div className={css.profileWrap}>
            <div
              className={css.profileImage}
              style={
                _.isNil(item.review) === false &&
                _.isNil(item.review.profileImageUrl) === false
                  ? {
                      backgroundImage: `url(${item.review.profileImageUrl})`,
                    }
                  : null
              }
            />
            <div className={css.profileContents}>
              <div>
                <div className={css.levelWrap}>
                  {/* 추후 적용 */}
                  {/* <div className={css.profileBox}>
                <div className={css.level}>1</div>
              </div> */}
                  <div className={css.userNickname}>
                    {item.review.userNickname}
                  </div>
                  {/* 유저 사이즈 */}
                  {renderUserSize}
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
              <div />
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
          <div className={css.contentWrap}>{item.review.textReview}</div>
          <div className={css.dateWithReportWrap}>
            <div className={css.dateWrap}>
              {moment(item.review.createdAtTimestamp).format(
                dateFormat.YYYYMMDD_UI
              )}
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

          {Array.isArray(toJS(item.reviewPhotos)) && item.reviewPhotos.length && (
            <div className={css.imageWrap}>
              {item.reviewPhotos.map((photo, index) => (
                <div
                  className={css.photo}
                  style={{
                    backgroundImage: `url("${photo.reviewPhotoUrl}?w=375")`,
                  }}
                  key={index}
                  onClick={() => this.setState({ isActivePhotoDetail: true })}
                />
              ))}
            </div>
          )}
          <div className={css.likeCommentWrap}>
            {login.loginStatus === loginStatus.LOGIN_DONE ? (
              _.isNil(checkBookmarks) === true ? (
                <div
                  className={css.likeWrap}
                  onClick={() => {
                    productreview.setProductReviewBookmarks(item.review.id);
                    item.review.bookmarkCount++;
                  }}
                >
                  <div>도움되었어요</div>
                  <div className={css.likeIcon} />
                  <div
                    className={css.bookmarkCount}
                  >{`${item.review.bookmarkCount}`}</div>
                </div>
              ) : (
                <div
                  className={css.likeWrap}
                  onClick={() => {
                    productreview.delProductReviewBookmarks(item.review.id);
                    item.review.bookmarkCount--;
                  }}
                >
                  <div>도움되었어요</div>
                  <div className={css.unLikeIcon} />
                  <div
                    className={css.bookmarkCount}
                  >{`${item.review.bookmarkCount}`}</div>
                </div>
              )
            ) : (
              <div className={css.likeWrap} onClick={() => sendBackToLogin()}>
                <div>도움되었어요</div>
                <div className={css.likeIcon} />
                <div
                  className={css.bookmarkCount}
                >{`${item.review.bookmarkCount}`}</div>
              </div>
            )}
            {item.review.replied ? (
              <div
                className={css.commentWrap}
                onClick={() => {
                  this.handleReviewReply();
                }}
              >
                <div
                  className={
                    this.state.reviewReply ? css.replyOn : css.replyOff
                  }
                >
                  셀러 댓글 1
                </div>
                <div
                  className={css.arrow}
                  style={
                    this.state.reviewReply
                      ? {
                          backgroundImage: `url('/public/icon/detail-icon-down-color@3x.png')`,
                        }
                      : {
                          backgroundImage: `url('/public/icon/detail-icon-arrow-open@3x.png')`,
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
          {this.state.isReportModalOpen && (
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
          )}
        </div>
      </>
    );
  }
}

export default ProductReviewItems;
