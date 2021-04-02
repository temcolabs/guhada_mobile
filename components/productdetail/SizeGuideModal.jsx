import React from 'react';
import css from './SizeGuideModal.module.scss';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';

function SizeGuideModal({ isOpen, sizeImageUrl, onClose }) {
  return (
    <div>
      <SlideIn direction={slideDirection.RIGHT} isVisible={isOpen}>
        <div className={css.sizeGuide}>
          <div className={css.sizeGuide__header}>
            <div className={css['sizeGuide__header--title']}>사이즈 가이드</div>
            <div
              className={css['sizeGuide__header--closeBtn']}
              onClick={onClose}
            />
          </div>
          <div
            className={css.sizeGuide__content}
            style={{
              backgroundImage: `url(${sizeImageUrl})`,
            }}
          />
        </div>
      </SlideIn>
    </div>
    // <ModalWrapper isOpen={isOpen} onClose={onClose} zIndex={9999}>
    // <div className={css.sizeGuide}>
    //   <div className={css.sizeGuide__header}>
    //     <div className={css['sizeGuide__header--title']}>사이즈 가이드</div>
    //     <div
    //       className={css['sizeGuide__header--closeBtn']}
    //       onClick={onClose}
    //     />
    //   </div>
    //   <div
    //     className={css.sizeGuide__content}
    //     style={{
    //       backgroundImage: `url(${sizeImageUrl})`,
    //     }}
    //   />
    // </div>
    // </ModalWrapper>
  );
}

export default SizeGuideModal;
