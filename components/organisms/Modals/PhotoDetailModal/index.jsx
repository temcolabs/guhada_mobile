import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import css from './Styles.module.scss';
import setScrollability from 'lib/dom/setScrollability';

import ModalWrapper from 'components/molecules/Modal/ModalMobileWrapper';
import Image from 'components/atoms/Image';

const IMAGE_PATH = {
  closeBtn: '/public/icons/button/close_btn_small/close_btn_small_3x.png',
  prevBtn:
    '/public/icons/arrow/photo_arrow_prev_small/photo_arrow_prev_small_3x.png',
  nextBtn:
    '/public/icons/arrow/photo_arrow_next_small/photo_arrow_next_small_3x.png',
};

/**
 * 포토 리뷰 상세 모달 컴포넌트
 * @param  {Boolean} {isOpen
 * @param  {Object[]} photos
 * @param  {Function} onClickClose}
 */
function PhotoDetailModal({ isOpen, photos, onClickClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // TODO : 비율에 따라 유동적 (?), https://zpl.io/VO7o67Q
  // const [ modalHeight, setModalHeight ] = useState(480);

  const onClickPrev = () => setCurrentIndex(currentIndex - 1);
  const onClickNext = () => setCurrentIndex(currentIndex + 1);

  useEffect(() => {
    return () => {
      setCurrentIndex(0);
    };
  }, []);

  return (
    <>
      <ModalWrapper
        isOpen={isOpen}
        zIndex={9999}
        children={
          <div className={css.modalPhotoDetailWrap}>
            {/* Close Button */}
            <div
              className={css.closeBtn}
              onClick={() => {
                onClickClose();
                setScrollability({ isLockScroll: false });
              }}
            >
              <Image src={IMAGE_PATH.closeBtn} width={'30px'} height={'30px'} />
            </div>

            {/* 컨텐츠 영역 */}
            <div className={cn(css.contents)}>
              {/* 이전 사진 버튼  */}
              {currentIndex !== 0 && (
                <div className={cn(css.prevBtn)} onClick={() => onClickPrev()}>
                  <Image
                    src={IMAGE_PATH.prevBtn}
                    width={'48px'}
                    height={'48px'}
                  />
                </div>
              )}
              {/* 다음 사진 버튼 */}
              {currentIndex !== photos.length - 1 && (
                <div className={cn(css.nextBtn)} onClick={() => onClickNext()}>
                  <Image
                    src={IMAGE_PATH.nextBtn}
                    width={'48px'}
                    height={'48px'}
                  />
                </div>
              )}
              {/* 이미지 */}
              <Image
                src={photos[currentIndex].reviewPhotoUrl || ''}
                size={'contain'}
              />
            </div>
          </div>
        }
      />
    </>
  );
}

PhotoDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  photos: PropTypes.array,
  onClickClose: PropTypes.func,
};

export default PhotoDetailModal;
