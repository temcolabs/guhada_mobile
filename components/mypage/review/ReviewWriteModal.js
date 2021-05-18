import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import css from './ReviewWriteModal.module.scss';
// import ReviewWriteOption from './ReviewWriteOption';
import ReviewWriteModalScore from './ReviewWriteModalScore';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { shape, func, bool, number, any } from 'prop-types';
import memoize from 'memoize-one';
import _ from 'lodash';
import ReviewImageUpload from './ReviewImageUpload';
import MySizeModal from 'components/mypage/userinfo/form/MySizeModal';
import isTruthy from 'childs/lib/common/isTruthy';
import cutByLen from 'childs/lib/common/cutByLen';
import ModalLayout from 'components/layout/ModalLayout';
import SubmitButton, {
  CancelButton,
  SubmitButtonWrapper,
} from 'components/mypage/form/SubmitButton';
import DealOrdered from '../DealOrdered';
import TextArea from 'components/mypage/form/TextArea';
import { LoadingSpinner } from 'components/common/loading/Loading';
import API from 'childs/lib/API';
import pointProcessService from 'childs/lib/API/benefit/pointProcessService';
import ReviewHashtagModal from 'template/Review/components/Modal/HashtagModal';
import FilterModal from 'template/Ranking/FilterModal';

// const color = ['BRIGHTER', 'SAME', 'DARKER'];
// const length = ['SHORT', 'REGULAR', 'LONG'];
// const size = ['SMALL', 'JUST_FIT', 'LARGE'];
const rating = [
  'HALF',
  'ONE',
  'ONE_HALF',
  'TWO',
  'TWO_HALF',
  'THREE',
  'THREE_HALF',
  'FOUR',
  'FOUR_HALF',
  'FIVE',
];

export const reviewModalType = {
  WRITE: 'Write',
  MODIFY: 'Modify',
};
const maxByte = 1000;

/**
 * 리뷰작성을 하기 위해서는 modalData props로
 * orderProdGroupId, productId 를 넘겨야 합니다.
 */
@inject('mypagereview', 'alert', 'mySize', 'productreview')
@observer
class ReviewWriteModal extends Component {
  static propTypes = {
    isOpen: bool,
    handleModalClose: func,
    status: any, // 작성 || 수정
    reviewData: any, // 리뷰 데이터
    modalData: shape({
      // 주문 데이터
      brandName: any, // 브랜드명 ,
      discountPrice: any, // 할인된 가격 ,
      expireDate: any, // 무통장 입금시 입금기한(무통장이 아니면경우 null) ,
      imageName: any, // 대표 이미지 파일명 ,
      imageUrl: any, // 대표 이미지 URL ,
      optionAttribute1: any, // 첫번째 옵션 ,
      optionAttribute2: any, // 두번째 옵션 ,
      optionAttribute3: any, // 세번째 옵션 ,
      orderDate: any, // 주문일 ,
      orderPrice: any, // 주문한 금액 ,
      originalPrice: any, // 원래 가격 ,
      prodName: any, // 상품명 ,
      productId: any,
      purchaseId: any, // 구매 데이터의 아이디 ,
      purchaseStatus: '', //
      purchaseStatusText: any, // 주문의 상태값 ,
      quantity: any, // 구매수량 ,
      season: any, // 시즌 ,
      sellerId: any, // 판매자의 아이디 ,
      sellerName: any, // 판매자의 이름 ,
      shipPrice: any, // 배송비 ,
      statusMessage: any, // 상태의 따른 메세지,
      orderProdGroupId: any, // 리뷰 작성을 위한 아이디
      orderProdId: number,
    }),
    onSuccessSubmit: func, // 리뷰 작성 API 호출 성공 콜백
    onSuccessModify: func, // 리뷰 수정 API 호출 성공 콜백
  };

  static defaultReviewData = {
    // sizeSatisfaction: 'JUST_FIT',
    // colorSatisfaction: 'SAME',
    // lengthSatisfaction: 'REGULAR',
    sizeSatisfaction: '',
    colorSatisfaction: '',
    lengthSatisfaction: '',
    createdAt: '',
    id: 0,
    bookmarkCount: 0,
    orderProductGroupId: 0,
    photoCount: 0,
    productId: 0,
    productRating: 'FIVE',
    textReview: '',
    userId: 0,
    userNickname: '',
    reviewHashtagList: null,
  };

  state = {
    totalByte: 0,
    imageList: [],
    imageFile: [],
    reviewData: Object.assign({}, ReviewWriteModal.defaultReviewData),
    isMySizeModalOpen: false,
    isOpenHashtagModal: false,
    reviewQuestion: [],
    questionIsLoading: 0,
    totalDueSave: 0,
  };

  componentDidMount() {
    const { productreview } = this.props;
    productreview.getProductReviewPoint();

    if (this.state.totalDueSave <= 0) {
      pointProcessService.getTotalDueSave().then((res) => {
        if (res.data.data && res.data.data.dueSavePointList.length) {
          const dueSavePoint = res.data.data.dueSavePointList[0];
          if (dueSavePoint.dueSaveType === 'MY_SIZE') {
            this.setState({ totalDueSave: dueSavePoint.totalPoint });
          }
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen, reviewData, modalData, status } = this.props;
    this.initReviewForm(
      isOpen,
      reviewData,
      modalData,
      status,
      this.state.isMySizeModalOpen
    );
  }

  /**
   * 리뷰 입력 데이터 초기화
   * isOpen, reviewData 값이 바뀔때 실행된다
   */
  initReviewForm = memoize((isOpen, reviewData, modalData, status) => {
    const { mypagereview } = this.props;
    if (isOpen) {
      mypagereview.checkUserSize();

      API.user
        .get(`/products/${modalData.productId}/review-question`)
        .then(({ data }) => {
          const reviewQuestion = data.data?.reviewQuestionList;

          if (!reviewQuestion || reviewQuestion.length !== 3) {
            throw new Error('[ERROR] review-question fetch');
          }

          if (status === reviewModalType.WRITE) {
            this.setState((prevState) => ({
              reviewData: {
                ...prevState.reviewData,
                sizeSatisfaction: reviewQuestion[0].answerList[1].code,
                colorSatisfaction: reviewQuestion[1].answerList[1].code,
                lengthSatisfaction: reviewQuestion[2].answerList[1].code,
              },
              reviewQuestion,
              questionIsLoading: 1,
            }));
          } else {
            this.setState({
              reviewQuestion,
              questionIsLoading: 1,
            });
          }
        })
        .catch((err) => {
          console.error(err.message);

          const reviewQuestion = [
            {
              question: '사이즈는 어떤가요?',
              answerList: [
                { code: 'SMALL', answer: '작아요' },
                { code: 'JUST_FIT', answer: '정사이즈에요' },
                { code: 'LARGE', answer: '생각보다 커요' },
              ],
            },
            {
              question: '컬러는 어떤가요?',
              answerList: [
                { code: 'BRIGHTER', answer: '화면보다 밝아요' },
                { code: 'SAME', answer: '화면과 같아요' },
                { code: 'DARKER', answer: '화면보다 어두워요' },
              ],
            },
            {
              question: '길이는 어떤가요?',
              answerList: [
                { code: 'SHORT', answer: '짧아요' },
                { code: 'REGULAR', answer: '적당해요' },
                { code: 'LONG', answer: '길어요' },
              ],
            },
          ];

          if (status === reviewModalType.WRITE) {
            this.setState((prevState) => ({
              reviewData: {
                ...prevState.reviewData,
                sizeSatisfaction: reviewQuestion[0].answerList[1].code,
                colorSatisfaction: reviewQuestion[1].answerList[1].code,
                lengthSatisfaction: reviewQuestion[2].answerList[1].code,
              },
              reviewQuestion,
              questionIsLoading: -1,
            }));
          } else {
            this.setState({
              reviewQuestion,
              questionIsLoading: -1,
            });
          }
        });
    }

    if (isOpen && !_.isNil(toJS(reviewData))) {
      // 기존의 리뷰 데이터로 입력 폼 초기화
      this.setState({
        reviewData: reviewData.review,
      });
      this.checkTextarea(reviewData.review.textReview);
      // 리뷰 이미지 설정
      if (!_.isNil(reviewData.reviewPhotos)) {
        mypagereview.initReviewPhotos(
          reviewData.reviewPhotos.sort(function(a, b) {
            return a['photoOrder'] - b['photoOrder'];
          })
        );
      } else if (_.isNil(reviewData.reviewPhotos)) {
        mypagereview.clearReviewPhotos();
      }
    } else {
      // 모달이 닫힘으로 전환되었다면 리뷰 입력 데이터를 초기화한다
      this.setState({
        reviewData: Object.assign({}, ReviewWriteModal.defaultReviewData),
        totalByte: 0,
      });

      mypagereview.clearReviewPhotos();
    }
  });

  setStarScore = (score) => {
    this.setState((prevState) => ({
      reviewData: { ...prevState.reviewData, productRating: score },
    }));
  };

  onChangeTextarea = (value) => {
    let totalByte = 0;
    for (let index = 0, length = value.length; index < length; index++) {
      let currentByte = value.charCodeAt(index);
      currentByte > 128 ? (totalByte += 2) : totalByte++;
    }

    if (totalByte > maxByte) {
      value = cutByLen(value, maxByte);
      totalByte = maxByte;
    }

    this.setState((prevState) => ({
      totalByte,
      reviewData: {
        ...prevState.reviewData,
        textReview: value,
      },
    }));
  };

  checkTextarea = (textReview) => {
    let totalByte = 0;
    let message = textReview;

    for (let index = 0, length = message.length; index < length; index++) {
      let currentByte = message.charCodeAt(index);
      currentByte > 128 ? (totalByte += 2) : totalByte++;
    }
    this.setState({
      totalByte,
    });
  };

  onChangeSize = (score) => {
    this.setState((prevState) => ({
      reviewData: {
        ...prevState.reviewData,
        sizeSatisfaction: score,
      },
    }));
  };

  onChangeColor = (score) => {
    this.setState((prevState) => ({
      reviewData: {
        ...prevState.reviewData,
        colorSatisfaction: score,
      },
    }));
  };

  onChangeLength = (score) => {
    this.setState((prevState) => ({
      reviewData: {
        ...prevState.reviewData,
        lengthSatisfaction: score,
      },
    }));
  };

  previewFile = (event) => {
    let files = event.target.files;
    const { mypagereview, alert } = this.props;
    const maxPhotoCount = 10;
    let photoLength = toJS(mypagereview.newReviewPhotos.length);
    let allowPhotoCount = maxPhotoCount - photoLength;

    if (allowPhotoCount > 0) {
      for (var i = 0; i < files.length; i++) {
        let reader = new FileReader();
        reader.onload = (e) => {
          mypagereview.setReviewPhotos(
            toJS(mypagereview.newReviewPhotos).concat({
              imageStatus: 'ADDED',
              reviewPhotoUrl: [e.target.result],
              newImage: true,
            })
          );
        };
        if (allowPhotoCount > i) {
          if (files[i]) reader.readAsDataURL(files[i]);
        }
      }

      let allowFiles = Array.from(files).filter(function(file, index) {
        return index < allowPhotoCount;
      });

      mypagereview.setReviewPhotosFile(
        mypagereview.reviewPhotosFile.concat(allowFiles)
      );
    } else {
      alert.showAlert('리뷰 사진은 최대 10장까지만 가능합니다.');
    }
  };

  onSubmit = () => {
    let { mypagereview, modalData, onSuccessSubmit } = this.props;
    let { reviewData } = this.state;

    if (reviewData.textReview === '') {
      this.props.alert.showAlert('리뷰 상세는 필수 입력입니다.');
    } else
      mypagereview.reviewSubmit({
        reviewData,
        orderProdGroupId: modalData.orderProdGroupId,
        productId: modalData.productId,
        sellerId: modalData.sellerId,
        onSuccess: onSuccessSubmit || this.props.handleModalClose,
      });
  };

  onModify = () => {
    let { mypagereview, modalData, onSuccessModify } = this.props;
    let { reviewData } = this.state;

    if (reviewData.textReview === '') {
      this.props.alert.showAlert('리뷰 상세는 필수 입력입니다.');
    } else
      mypagereview.reviewModify({
        reviewData,
        orderProdGroupId: modalData.orderProdGroupId,
        productId: modalData.productId,
        sellerId: modalData.sellerId,
        onSuccess: onSuccessModify || this.props.handleModalClose,
      });
  };

  onClickAddHashtag = (isOpenHashtagModal) => {
    this.setState({
      ...this.state,
      isOpenHashtagModal,
    });
  };

  renderStars = (startCount) => {
    let starCount = rating.indexOf(this.state.reviewData.productRating) + 1;
    let starItems = [];

    for (let i = 0; i < 10; i++) {
      if (i < starCount) {
        if (i % 2 === 0)
          starItems.push(
            <img
              src="/static/icon/big_star_yellow_half_l.png"
              width={25}
              height={50}
              key={i}
              onMouseOver={() => this.setStarScore(rating[i])}
            />
          );
        else
          starItems.push(
            <img
              src="/static/icon/big_star_yellow_half_r.png"
              width={25}
              height={50}
              key={i}
              onMouseOver={() => this.setStarScore(rating[i])}
            />
          );
      } else {
        if (i % 2 === 0)
          starItems.push(
            <img
              src="/static/icon/big_star_grey_half_l.png"
              width={25}
              height={50}
              key={i}
              onMouseOver={() => this.setStarScore(rating[i])}
            />
          );
        else
          starItems.push(
            <img
              src="/static/icon/big_star_grey_half_r.png"
              width={25}
              height={50}
              key={i}
              onMouseOver={() => this.setStarScore(rating[i])}
            />
          );
      }
    }

    return starItems;
  };

  toggleMySizeModal = () => {
    this.props.mypagereview.closeReviewModal();
    this.setState({ isMySizeModalOpen: !this.state.isMySizeModalOpen });
  };

  handleSubmitMySize = (mySize) => {
    this.props.mySize.submitMySize({
      mySize,
      onComplete: this.toggleMySizeModal,
    });
    this.toggleMySizeModal();
  };

  render() {
    const { isOpen, modalData, mypagereview, productreview } = this.props;
    const isModalDataExists = isTruthy(toJS(modalData));
    const isModalOpen = isOpen && isModalDataExists;
    const item = modalData || {};
    const isCreate = this.props.status === reviewModalType.WRITE;

    return (
      <>
        <ModalLayout
          pageTitle={isCreate ? '리뷰 등록' : '리뷰 수정'}
          isOpen={isModalOpen}
          onClose={this.props.handleModalClose}
        >
          <div className={css.modalWrap}>
            {mypagereview.isPossibleSetUserSize === true && (
              <div className={css.sizeAddWrap}>
                <div className={css.sizeAddContents}>
                  <div className={css.sizeAddIcon}>!</div>
                  <span>
                    {this.state.totalDueSave > 0
                      ? `내 사이즈 등록하면 적립금 ${this.state.totalDueSave.toLocaleString()}원 적립!`
                      : '내 사이즈를 등록해주세요!'}
                  </span>
                  <div className={css.sizeIconWrapper}>
                    <span
                      className={css.sizeAddButton}
                      onClick={() => this.toggleMySizeModal()}
                    >
                      내 사이즈 등록
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className={css.reviewItemWrap}>
              <DealOrdered
                order={item}
                isSmallImage={false}
                isBrandAndProductInSameLine={false}
                hasOptionQuantity={true}
                isPurchaseStatusVisible
                isPriceVisible
              />
            </div>
            <div className={css.starWrap}>
              <div className={css.starHeader}>상품은 만족하시나요?</div>
              <div>{this.renderStars()}</div>
            </div>

            {this.state.questionIsLoading && (
              <>
                <ReviewWriteModalScore
                  header={this.state.reviewQuestion[0].question}
                  score={this.state.reviewData.sizeSatisfaction}
                  items={this.state.reviewQuestion[0].answerList.map(
                    (item) => item.code
                  )}
                  itemsText={this.state.reviewQuestion[0].answerList.map(
                    (item) => item.answer
                  )}
                  onChangeScore={this.onChangeSize}
                />
                <ReviewWriteModalScore
                  header={this.state.reviewQuestion[1].question}
                  score={this.state.reviewData.colorSatisfaction}
                  items={this.state.reviewQuestion[1].answerList.map(
                    (item) => item.code
                  )}
                  itemsText={this.state.reviewQuestion[1].answerList.map(
                    (item) => item.answer
                  )}
                  onChangeScore={this.onChangeColor}
                />
                <ReviewWriteModalScore
                  header={this.state.reviewQuestion[2].question}
                  score={this.state.reviewData.lengthSatisfaction}
                  items={this.state.reviewQuestion[2].answerList.map(
                    (item) => item.code
                  )}
                  itemsText={this.state.reviewQuestion[2].answerList.map(
                    (item) => item.answer
                  )}
                  onChangeScore={this.onChangeLength}
                />
              </>
            )}

            {/* ! UI가 API에 영향을 미치지 않으므로 숨김. 추후 작성 옵션이 늘어난다면 다시 추가 */}
            {/* <ReviewWriteOption /> */}
            <div className={css.textareaWrap}>
              <TextArea
                type={'review'}
                onChange={this.onChangeTextarea}
                // maxLength={1000}
                placeholder={`어떤 점이 좋으셨나요?\n사진과 함께 리뷰 작성 시 ${
                  productreview.maximumPoint
                }P 적립!\n상품에 대한 솔직한 리뷰를 작성해주세요.`}
                initialValue={this.state.reviewData?.textReview || ''}
              />
            </div>
            {/* TODO : Hash 태그 컴포넌트 추가 */}
            {/* <div className={css.hashtagWrap}>
              <div onClick={() => this.onClickAddHashtag(true)} />
              <div>#해시태그를 입력해주세요</div>
            </div> */}
            <div className={css.photoWrap}>
              <label className={css.photoItemWrap} htmlFor="photo_upload">
                <input
                  type="file"
                  onChange={this.previewFile}
                  multiple
                  id="photo_upload"
                />
                <div className={css.photoText}>첨부파일</div>
              </label>
              {mypagereview.newReviewPhotos.length !== 0 ? (
                <ReviewImageUpload />
              ) : null}
            </div>

            <div className={css.warning}>
              <div>
                상품과 관련 없는 내용이 포함될 경우, <br />
                통보 없이 삭제 및 적립 혜택이 회수될 수 있습니다.
              </div>
            </div>

            <SubmitButtonWrapper fixedToBottom>
              <CancelButton
                onClick={() => {
                  this.props.handleModalClose();
                  mypagereview.initReviewPhotos();
                }}
              >
                취소
              </CancelButton>
              <SubmitButton onClick={isCreate ? this.onSubmit : this.onModify}>
                {isCreate ? '등록' : '수정'}
              </SubmitButton>
            </SubmitButtonWrapper>
          </div>
          <MySizeModal
            // mySize={this.props.mySize.mySize}
            isOpen={this.state.isMySizeModalOpen}
            onClose={this.toggleMySizeModal}
            onSubmitMySize={this.handleSubmitMySize}
            showAlert={this.props.alert.showAlert}
          />
        </ModalLayout>
      </>
    );
  }
}

export default ReviewWriteModal;
