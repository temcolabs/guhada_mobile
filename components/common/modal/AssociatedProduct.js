import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import ModalWrapper from './ModalWrapper';
import css from './AssociatedProduct.module.scss';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
const AlertBtns = ({ onConfirm = () => {}, confirmText }) => (
  <div className={css.alertButtons}>
    <button onClick={onConfirm}>{confirmText || '확인'}</button>
  </div>
);

@inject('cartAndPurchase', 'shoppingCartSuccess')
@observer
class AssociatedProduct extends React.Component {
  static defaultProps = {
    onConfirm: () => {},
    onCancel: () => {},
  };

  get bodyText() {
    const { content } = this.props.shoppingCartSuccess;
    return ReactDOMServer.renderToString(content);
  }

  render() {
    let { cartAndPurchase, shoppingCartSuccess } = this.props;

    const {
      isOpen,
      onCancel,
      onConfirm,
      isButtonVisible = true,
      content,
      children,
      contentLabel = 'alert',
      zIndex,
      confirmText,
    } = shoppingCartSuccess;

    return (
      <ModalWrapper
        isOpen={isOpen}
        contentLabel={contentLabel}
        onClose={onConfirm || onCancel}
        zIndex={zIndex}
        confirmText={confirmText}
        content={{
          top: '100%',
          left: '50%',
          bottom: 'initial',
          right: 'initial',
          background: 'transparent',
          width: '100%',
          padding: 0,
          overflow: 'hidden',
          border: 'none',
          borderRadius: 0,
        }}
      >
        <div className={css.ModalContentWrap}>
          <div className={css.modal}>
            <div
              className={css.modalClose}
              onClick={() => {
                shoppingCartSuccess.shoppingCartSuccessModalClose();
              }}
            >
              <img
                src="/static/icon/modal_close.png"
                alt="장바구니 모달창 닫기"
              />
            </div>
            <div className={css.wrapTitle}>
              상품이 장바구니에 추가되었습니다.
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
                      <Link
                        href={`/productdetail?deals=${data.dealId}`}
                        key={index}
                      >
                        <li className={css.associatedItem}>
                          <div className={css.associatedItemImage}>
                            <img src={data.imageUrl} alt="연관상품" />
                          </div>
                          <div className={css.brandName}>
                            <span>{data.brandName}</span>
                            <span>{data.productSeason}</span>
                          </div>
                          <div className={css.productName}>
                            {data.productName}
                          </div>
                        </li>
                      </Link>
                    );
                  })}
              </ul>
            </div>
            <div className={css.btnGroup}>
              <div
                onClick={() => {
                  shoppingCartSuccess.shoppingCartSuccessModalClose();
                }}
              >
                장바구니로 이동
              </div>
            </div>
          </div>
        </div>
      </ModalWrapper>
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
