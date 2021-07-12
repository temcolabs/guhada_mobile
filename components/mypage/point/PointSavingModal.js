import React, { useMemo } from 'react';
import ModalWrapper from 'components/common/modal/ModalWrapper';
import css from './PointSavingModal.module.scss';
import cn from 'classnames';
import addCommaToNum from 'lib/common/addCommaToNum';
import { pushRoute } from 'lib/router';

/**
 * 포인트 적립 형태
 */
export const pointSavingTypes = {
  CONFIRM_PURCHASE: 'BUY', // 구매확정
  CREATE_REVIEW: 'REVIEW', // 리뷰 작성
  REGISTER_MYSIZE: 'REGISTER_MYSIZE', // 내 사이즈 등록
  SIGNUP: 'SIGNUP',
};

/**
 * 구매확정시 표시할 컨텐츠
 * @param {*} param0
 */
const ConfirmPointNoti = ({
  savedPointResponse = {
    savedPoint: 0,
    message: '구매확정 완료!',
    dueSavedPoint: 0,
  },
  onClose = () => {},
}) => {
  return (
    <div>
      <h2 className={css.savedPointHeading}>
        포인트 {addCommaToNum(savedPointResponse.savedPoint)}
        <span>원</span>
      </h2>

      <div className={css.pointTypeText}>{savedPointResponse.message}</div>

      <div className={css.dueSavedPointText}>
        지금 리뷰 작성하고 포인트 <br />
        <b>최대 {addCommaToNum(savedPointResponse.dueSavedPoint)}원</b> 적립
        받으세요!
      </div>

      <div className={css.submitButtonWrapper}>
        <button
          type="button"
          className={css.submitButton}
          onClick={() => {
            onClose();
            pushRoute(`/mypage/review`);
          }}
        >
          리뷰쓰고 포인트 더 받기
        </button>

        <button
          type="button"
          className={cn(css.submitButton, css.gray)}
          onClick={onClose}
        >
          다음에 쓸게요
        </button>
      </div>
    </div>
  );
};

/**
 * 리뷰 작성시 표시할 컨텐츠
 * @param {*} savedPointResponse.savedPoint 적립 포인트
 * @param {*} savedPointResponse.message 메시지
 * @param {*} savedPointResponse.totalFreePoint 나의 포인트
 */
const ReviewPointNoti = ({
  savedPointResponse = {
    savedPoint: 0,
    message: '리뷰작성 완료!',
    dueSavedPoint: 0,
  },
  onClose = () => {},
}) => {
  return (
    <div>
      <h2 className={css.savedPointHeading}>
        포인트 {addCommaToNum(savedPointResponse.savedPoint)}
        <span>원</span>
      </h2>

      <div className={css.pointTypeText}>{savedPointResponse.message}</div>

      <div className={css.myCurrentPointBox}>
        <span>나의 포인트</span>
        <span className={css.point}>
          {addCommaToNum(savedPointResponse.totalFreePoint)}P
        </span>
      </div>

      <div className={css.submitButtonWrapper}>
        <button type="button" className={css.submitButton} onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
};

/**
 * 디자인: zpl://screen?sid=5cece5683dd1771d98bce12a&pid=5ca71f1be141ada0c0df7152
 * 포인트적립 안내 모달
 */
export default function PointSavingModal({
  isOpen,
  onClose = () => {},
  savedPointResponse = {
    savedPoint: 0, // 적립된 포인트
    message: '구매확정 완료!',
    dueSavedPoint: 0, // 적립 예정 포인트
    totalFreePoint: 0, // 나의 포인트
  }, // 포인트 적립 관련 데이터
  pointSavingType = pointSavingTypes.CONFIRM_PURCHASE,
}) {
  const modalContents = useMemo(() => {
    switch (pointSavingType) {
      case pointSavingTypes.CONFIRM_PURCHASE:
        return (
          <ConfirmPointNoti
            savedPointResponse={savedPointResponse}
            onClose={onClose}
          />
        );

      // 리뷰 등록과 사이즈 등록은 같은 모달을 사용한다
      case pointSavingTypes.CREATE_REVIEW:
      case pointSavingTypes.REGISTER_MYSIZE:
      case pointSavingTypes.SIGNUP:
        return (
          <ReviewPointNoti
            savedPointResponse={savedPointResponse}
            onClose={onClose}
          />
        );

      default:
        return () => {};
    }
  }, [onClose, pointSavingType, savedPointResponse]);

  return (
    <ModalWrapper
      isOpen={isOpen}
      contentLabel={'PointSavingModal'}
      onClose={onClose}
      onRequestClose={onClose}
      contentStyle={{
        overflow: 'visible',
      }}
    >
      <div className={css.mainImage} />

      <div className={css.wrap}>{modalContents}</div>
    </ModalWrapper>
  );
}
