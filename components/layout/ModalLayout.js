import React, { useState, useEffect, useCallback } from 'react';
import css from './ModalLayout.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

export const useModalLayoutState = ({
  isModalOpen = false, // 모달 열림 닫힘 여부. UI를 통해 동적으로 변경할 값
  onClose = () => {},
}) => {
  const [isModalLayoutOpen, setIsModalLayoutOpen] = useState(false);

  const handleChangeVisibility = useCallback(
    isOpen => {
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

function ModalLayout({ pageTitle, children, isOpen, onClose, wrapperStyle }) {
  return (
    <SlideIn direction={slideDirection.BOTTOM} isVisible={isOpen}>
      <div className={css.wrap} style={wrapperStyle}>
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
