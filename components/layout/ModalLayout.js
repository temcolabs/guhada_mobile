import React, { useState, useEffect, useCallback } from 'react';
import css from './ModalLayout.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

export const useModalLayoutState = ({
  isModalOpen = false, // 모달 열림 닫힘 여부. UI를 통해 동적으로 변경할 값
  isOpenOnMount = false, // 고정값. 마운팅과 함께 모달을 표시하기 위한 목적
  onClose = () => {},
}) => {
  const [isModalLayoutOpen, setIsModalLayoutOpen] = useState(false);

  const handleChangeVisibility = useCallback(
    isOpen => {
      setIsModalLayoutOpen(isOpen);

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
    if (isOpenOnMount) {
      handleChangeVisibility(true);
    }
  }, [handleChangeVisibility, isOpenOnMount]);

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
        <div className={css.content}>{children}</div>
      </div>
    </SlideIn>
  );
}
export default ModalLayout;
