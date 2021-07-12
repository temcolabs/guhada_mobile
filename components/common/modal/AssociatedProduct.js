import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import ModalWrapper from './ModalWrapper';
import css from './AssociatedProduct.module.scss';
import { inject, observer } from 'mobx-react';
const AlertBtns = ({ onConfirm = () => {}, confirmText }) => (
  <div className={css.alertButtons}>
    <button onClick={onConfirm}>{confirmText || '확인'}</button>
  </div>
);

@inject('cartAndPurchase', 'shoppingCartSuccessModal')
@observer
class AssociatedProduct extends React.Component {
  static defaultProps = {
    onConfirm: () => {},
    onCancel: () => {},
  };

  get bodyText() {
    const { content } = this.props.shoppingCartSuccessModal;
    return ReactDOMServer.renderToString(content);
  }

  render() {
    let { cartAndPurchase, shoppingCartSuccessModal } = this.props;
    const {
      onCancel,
      onConfirm,
      contentLabel = 'alert',
      contentStyle,
      zIndex,
      confirmText,
    } = shoppingCartSuccessModal.props;

    const { isOpen } = shoppingCartSuccessModal;

    return (
      <>
        {isOpen && (
          <ModalWrapper
            isOpen={isOpen}
            contentLabel={contentLabel}
            onClose={onConfirm || onCancel}
            zIndex={zIndex}
            confirmText={confirmText}
            contentStyle={contentStyle}
            onConfirm={onConfirm}
          >
            <div className={css.modal}>
              <div className={css.modal__inner}>
                <div className={css.modal__top}>
                  <div className={css.wrapTitle}>
                    상품이 장바구니에 <br />
                    추가되었습니다.
                  </div>
                  <div
                    className={css.modalClose}
                    onClick={() => {
                      shoppingCartSuccessModal.hide();
                    }}
                  >
                    <img
                      src="/public/icon/modal_close.png"
                      alt="장바구니 모달창 닫기"
                    />
                  </div>
                </div>
                <div className={css.associatedProduct}>
                  <div className={css.associatedProductTitle}>
                    이 상품과 함께 많이 구매한 상품
                  </div>
                  <ul>
                    {cartAndPurchase.associatedProduct
                      .slice(0, 3)
                      .map((data, index) => {
                        return (
                          <li
                            className={css.associatedItem}
                            key={index}
                            onClick={() => {
                              shoppingCartSuccessModal.goProduct(data.dealId);
                            }}
                          >
                            <div
                              className={css.associatedItemImage}
                              style={{
                                backgroundImage: `url(${data.imageUrl})`,
                              }}
                            />
                            <div className={css.brandName}>
                              <span>{data.brandName}</span>
                              {/* <span>{data.productSeason}</span> */}
                            </div>
                            <div className={css.productName}>
                              {data.productName}
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
              <AlertBtns confirmText={confirmText} onConfirm={onConfirm} />
            </div>
          </ModalWrapper>
        )}
      </>
    );
  }
}

AssociatedProduct.propTypes = {
  isOpen: PropTypes.bool,
  isConfirm: PropTypes.bool, // alert인지 confirm인지
  onConfirm: PropTypes.func, // 확인 버튼 콜
  onCancel: PropTypes.func, // 취소 버튼 콜
  onRequestClose: PropTypes.func, // 확인, 취소 누르지 않고 닫기
  contentStyle: PropTypes.object,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // modal body에 들어갈 내용. React component, HTML 시용 가능
  children: PropTypes.element, // children이 있으면 content 무시
  isButtonVisible: PropTypes.bool, // 기본 버튼 표시 여부
  confirmText: PropTypes.string, // 확인 버튼 텍스트
  cancelText: PropTypes.string, // 취소 버튼 텍스트
  zIndex: PropTypes.number,
  contentLabel: PropTypes.string,
};

export default AssociatedProduct;
