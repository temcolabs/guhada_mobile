import css from './OrderConfirmModal.module.scss';
import addCommaToNum from 'lib/common/addCommaToNum';
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
              {dueSavePointOnFirstPurchase > 0 ? (
                <div className={css.pointGuide__item}>
                  <div className={css.pointGuide__condition}>첫 구매 시</div>
                  <div className={css.pointGuide__result}>
                    포인트 {addCommaToNum(dueSavePointOnFirstPurchase)}원
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <h3 className={css.pointCaution}>
          <Notimark wrapperStyle={{ marginRight: '4px' }} />
          <span>포인트 적립 유의사항</span>
        </h3>
        <ul className={css.pointCaution_list}>
          <li></li>
          <li>
            텍스트 리뷰와 포토 리뷰 작성시 적립금은 중복 지급되지 않습니다.
          </li>
          <li>
            해당 상품과 무관한 리뷰는 통보없이 삭제 및 적립 혜택이 회수될 수
            있습니다.
          </li>
        </ul>
      </div>
      <SubmitButtonWrapper
        responsive
        fixedToBottom
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
