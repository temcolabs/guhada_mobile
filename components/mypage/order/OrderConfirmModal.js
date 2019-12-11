import React from 'react';
import css from './OrderConfirmModal.module.scss';
import addCommaToNum from 'childs/lib/common/addCommaToNum';
import SubmitButton, {
  SubmitButtonWrapper,
  CancelButton,
} from '../form/SubmitButton';
import Notimark from 'components/common/icon/Notimark';
import ModalLayout, {
  useModalLayoutState,
} from 'components/layout/ModalLayout';

/**
 * 구매확정 모달
 * 디자인: zpl://screen?sid=5cece5683dd1771d98bce12a&pid=5ca71f1be141ada0c0df7152
 */
export default function OrderConfirmModal({
  isOpen,
  onConfirm = () => {},
  onClose = () => {},
  order = {
    brandName: 'brandName',
    prodName: 'prodName',
  },
  dueSavePointOnConfirm = 0,
  dueSavePointOnReview = 0,
  dueSavePointOnFirstPurchase = 0,
}) {
  const { isModalLayoutOpen } = useModalLayoutState({
    isModalOpen: isOpen,
  });

  return (
    <ModalLayout
      isOpen={isModalLayoutOpen}
      onClose={onClose}
      wrapperStyle={{
        paddingBottom: '90px',
      }}
    >
      <div className={css.wrap}>
        <div>
          <h2 className={css.title}>구매확정을 진행해주세요!</h2>

          <div className={css.confirmGuide}>
            구매확정 이후에는 반품・교환이 불가하므로 <br />
            반드시 상품을 받으신 후 진행해주세요.
          </div>
        </div>

        <div className={css.product}>
          <div
            className={css.productImage}
            style={{
              backgroundImage: `url(${order?.imageUrl})`,
            }}
          />

          <div className={css.productInfo}>
            <div className={css.brandAndProductName}>
              <span className={css.brandName}>{order?.brandName}</span>{' '}
              <span className={css.prodName}>{order?.prodName}</span>
            </div>

            <div className={css.pointGuide}>
              <div className={css.pointGuide__item}>
                <div className={css.pointGuide__condition}>구매 확정 시</div>
                <div className={css.pointGuide__result}>
                  포인트 {addCommaToNum(dueSavePointOnConfirm)}원
                </div>
              </div>
              <div className={css.pointGuide__item}>
                <div className={css.pointGuide__condition}>리뷰 작성 시</div>
                <div className={css.pointGuide__result}>
                  포인트 최대 {addCommaToNum(dueSavePointOnReview)}원
                </div>
              </div>
              <div className={css.pointGuide__item}>
                <div className={css.pointGuide__condition}>첫 구매 시</div>
                <div className={css.pointGuide__result}>
                  포인트 {addCommaToNum(dueSavePointOnFirstPurchase)}원
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className={css.pointCaution}>
          <Notimark wrapperStyle={{ marginRight: '4px' }} />
          <span>포인트 적립 유의사항</span>
        </h3>
        <ul className={css.pointCaution_list}>
          <li>
            한달 사용 리뷰 작성 포인트는 위와 별개이며, 구매확정 이후 31일부터
            [마이페이지 > 상품리뷰] 에서 작성 가능합니다.
          </li>
          <li>
            텍스트 리뷰와 포토/동영상 리뷰 적립 혜택은 중복으로 지급되지 않으며,
            <br />
            최초 작성한 리뷰 기준으로 지급됩니다.
          </li>
          <li>
            해당 상품과 무관한 내용이나 동일 문자의 반복 등 부적합한 내용의 리뷰
            작성은 통보 없이 <br />
            삭제 및 적립 혜택이 회수될 수 있습니다.
          </li>
        </ul>
      </div>
      <SubmitButtonWrapper
        responsive
        fixedAtBottom
        wrapperClassname={css.submitButtonWrapper}
      >
        <CancelButton onClick={onClose}>취소</CancelButton>
        <SubmitButton type="button" onClick={onConfirm}>
          구매확정
        </SubmitButton>
      </SubmitButtonWrapper>
    </ModalLayout>
  );
}
