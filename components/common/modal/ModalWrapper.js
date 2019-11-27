import React from 'react';
import ReactModal from 'react-modal';
import css from './ModalWrapper.module.scss';
import PropTypes from 'prop-types';
import isServer from 'childs/lib/common/isServer';
import setScrollability from 'childs/lib/dom/setScrollability';
import documentHeight from 'childs/lib/dom/documentHeight';

export const ModalContentWrap = ({ children }) => (
  <div className={css.wrap}>{children}</div>
);

/**
 * 컨텐츠를 전달할 수 있는 모달 컨테이너
 */
class ModalWrapper extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool, // 표시 여부
    onClose: PropTypes.func, // 모달이 닫힐 때 콜백
    overlayStyle: PropTypes.object, // 모달 오버레이(모달의 상위 element) 스타일.
    contentStyle: PropTypes.object, // 모달 래퍼 스타일. 사이즈, 위치 등을 설정
    contentLabel: PropTypes.string, // accessibility를 위한 모달 아이디.
    zIndex: PropTypes.number,
    children: PropTypes.any,
    closeTimeoutMS: PropTypes.number, // 모달 닫힘 딜레이. transition을 위한 시간
    lockScroll: PropTypes.bool, // 오픈되었을 때 스크롤을 막을 것인지
    isBigModal: PropTypes.bool, // 브라우저 높이를 넘어서는 큰 사이즈 모달 여부
  };

  static defaultProps = {
    lockScroll: true,
  };

  componentDidMount() {
    this.updateScrollabilty();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen !== prevProps.isOpen) {
      this.updateScrollabilty();
    }
  }

  get overlayStyle() {
    if (this.props.isBigModal) {
      return {
        position: 'absolute',
        width: '100%',
        height: documentHeight() + 'px',
        ...this.props.overlayStyle,
      };
    } else {
      return this.props.overlayStyle;
    }
  }

  get contentStyle() {
    const scrollY = isServer ? 0 : window.scrollY;

    if (this.props.isBigModal) {
      return {
        top: `${scrollY + 100}px`,
        transform: `translateX(-50%)`,
        ...this.props.contentStyle,
      };
    } else {
      return this.props.contentStyle;
    }
  }

  /**
   * 오픈되었을 때 스크롤 방지 여부.
   * 큰 사이즈의 모달이라면 무조건 스크롤 가능해야 한다.
   */
  get isLockScrollEnabled() {
    return this.props.isBigModal ? false : this.props.lockScroll;
  }

  updateScrollabilty = () => {
    if (this.isLockScrollEnabled) {
      if (this.props.isOpen) {
        setScrollability({ isLockScroll: this.props.lockScroll && true }); // 스크롤 방지
      } else {
        setScrollability({ isLockScroll: this.props.lockScroll && false }); // 스크롤 허용
      }
    }
  };

  render() {
    const {
      isOpen,
      onClose,
      contentLabel,
      zIndex,
      children,
      closeTimeoutMS = 200,
    } = this.props;
    return (
      <ReactModal
        isOpen={isOpen}
        contentLabel={contentLabel || 'guhada-modal'}
        onRequestClose={onClose}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: zIndex || 201,
            ...this.overlayStyle,
          },
          content: {
            top: '50%',
            left: '50%',
            bottom: 'initial',
            right: 'initial',
            transform: 'translate(-50%, -50%)',
            background: 'transparent',
            padding: 0,
            overflow: 'hidden',
            border: 'none',
            borderRadius: 0,
            ...this.contentStyle,
          },
        }}
        closeTimeoutMS={closeTimeoutMS}
      >
        {children}
      </ReactModal>
    );
  }
}

export default ModalWrapper;
