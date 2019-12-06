import React, { useState, useEffect, useCallback } from 'react';
import css from './ModalLayout.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

export const useModalLayoutState = ({
  isOpenOnMount = false,
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
    console.log('useEffect');
    if (isOpenOnMount) {
      handleChangeVisibility(true);
    }
  }, [handleChangeVisibility, isOpenOnMount]);

  return {
    isModalLayoutOpen,
    openModalLayout,
    closeModalLayout,
    handleChangeVisibility,
  };
};

function ModalLayout({ pageTitle, children, isOpen, onClose }) {
  return (
    <SlideIn direction={slideDirection.BOTTOM} isVisible={isOpen}>
      <div className={css.wrap}>
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
