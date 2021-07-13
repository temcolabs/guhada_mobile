import { Component, Fragment } from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import ModalWrapper from './ModalWrapper';
import css from './Alert.module.scss';

const AlertBtns = ({ onConfirm = () => {}, confirmText }) => (
  <div className={css.alertButtons}>
    <button onClick={onConfirm}>{confirmText || '확인'}</button>
  </div>
);

const ConfirmBtns = ({
  onCancel = () => {},
  onConfirm = () => {},
  confirmText,
  cancelText,
}) => {
  return (
    <div className={css.confirmButtons}>
      <button
        type="button"
        onClick={onCancel}
        style={{ backgroundColor: '#444444', color: '#fff' }}
      >
        {cancelText || '취소'}
      </button>
      <button type="submit" onClick={onConfirm}>
        {confirmText || '확인'}
      </button>
    </div>
  );
};

class Alert extends Component {
  static defaultProps = {
    onConfirm: () => {},
    onCancel: () => {},
  };

  get bodyText() {
    const { content } = this.props;
    return ReactDOMServer.renderToString(content);
  }

  render() {
    const {
      isOpen,
      onCancel,
      onConfirm,
      isButtonVisible = true,
      content,
      isConfirm,
      children,
      contentLabel = 'alert',
    } = this.props;

    return (
      <ModalWrapper
        isOpen={isOpen}
        contentLabel={contentLabel}
        onClose={onConfirm || onCancel}
        zIndex={9999}
      >
        <div className={css.ModalContentWrap}>
          <div className={css.modalBody}>
            {children ? (
              <div className={css.alertBody}>{children()}</div>
            ) : (
              <Fragment>
                {typeof content === 'function' ? ( // if react component
                  <div className={css.alertBody}>{content()}</div>
                ) : (
                  <div
                    className={css.alertBody}
                    dangerouslySetInnerHTML={{
                      __html: this.bodyText,
                    }}
                  />
                )}
                {isButtonVisible &&
                  (!isConfirm ? (
                    <AlertBtns {...this.props} />
                  ) : (
                    <ConfirmBtns {...this.props} />
                  ))}
              </Fragment>
            )}
          </div>
        </div>
      </ModalWrapper>
    );
  }
}

Alert.propTypes = {
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

export default Alert;
