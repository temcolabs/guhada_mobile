import { useState, useEffect, useCallback } from 'react';
import css from './ModalLayout.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

export const useModalLayoutState = ({
  isModalOpen = false, // 모달 열림 닫힘 여부. UI를 통해 동적으로 변경할 값
  onClose = () => {},
}) => {
  const [isModalLayoutOpen, setIsModalLayoutOpen] = useState(false);

  const handleChangeVisibility = useCallback(
    (isOpen) => {
      setIsModalLayoutOpen(isOpen);

      // 닫힘 기능외에 추가로 실행할 콜백 호출
      if (typeof onClose === 'function' && !isOpen) {
        onClose();
      }
    },
    [onClose]
  );

  const openModalLayout = useCallback(() => {
    handleChangeVisibility(true);
  }, [handleChangeVisibility]);

  const closeModalLayout = useCallback(() => {
    handleChangeVisibility(false);
  }, [handleChangeVisibility]);

  useEffect(() => {
    handleChangeVisibility(isModalOpen);
  }, [handleChangeVisibility, isModalOpen]);

  return {
    isModalLayoutOpen,
    openModalLayout,
    closeModalLayout,
    handleChangeVisibility,
  };
};

/**
 * 클래스 컴포넌트 내부에서 사용할때는 useModalLayoutState를 사용할 수 없다.
 * @param {*} param0
 */
function ModalLayout({
  pageTitle,
  children,
  isOpen,
  onClose,
  zIndex,
  wrapperStyle = {},
  wrapperChildStyle = {}, // css.wrap 커스텀 스타일
  direction = slideDirection.RIGHT,
}) {
  return (
    <SlideIn
      direction={direction}
      isVisible={isOpen}
      wrapperStyle={wrapperStyle}
      zIndex={zIndex}
    >
      <div
        className={css.wrap}
        style={{ ...wrapperStyle, ...wrapperChildStyle }}
      >
        <div className={css.header}>
          <div className={css.title}>{pageTitle || ''}</div>
          <div className={css.close} onClick={onClose} />
        </div>

        {children}
      </div>
    </SlideIn>
  );
}
export default ModalLayout;
