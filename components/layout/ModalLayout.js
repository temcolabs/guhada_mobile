import React, { useState, useEffect } from 'react';
import css from './ModalLayout.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

function ModalLayout({ isVisible, onClose, pageTitle, children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);
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
