import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import cn from 'classnames';
import css from './Styles.scss';

import setScrollability from 'childs/lib/dom/setScrollability';

const ModalWrapper = dynamic(() => import('../ModalMobileWrapper'));

/**
 * 포토 리뷰 상세 모달 컴포넌트
 * @param  {Boolean} {isOpen
 * @param  {Object[]} photos
 * @param  {Function} onClickClose}
 */
function ModalPhotoDetail({ isOpen, photos, onClickClose }) {
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
        children={
          <div className={css.container}>
            {/* Empty, Close Button 영역 */}
            <div className={cn(css.box, css.box_empty, css.box_empty_close)}>
              <button
                className={cn(css.close__btn, css.close__btn__small)}
                onClick={() => {
                  onClickClose();
                  setScrollability({ isLockScroll: false });
                }}
              />
            </div>

            {/* 컨텐츠 영역 */}
            <div className={cn(css.box, css.box_content)}>
              {/* 이전 사진 버튼 */}
              {currentIndex !== photos.length - 1 && (
                <button
                  className={cn(css.next__btn, css.next__btn__small)}
                  onClick={() => onClickNext()}
                />
              )}
              {/* 다음 사진 버튼  */}
              {currentIndex !== 0 && (
                <button
                  className={cn(css.prev__btn, css.prev__btn__small)}
                  onClick={() => onClickPrev()}
                />
              )}
              {/* 이미지 */}
              <img
                className={css.photo}
                src={photos[currentIndex].reviewPhotoUrl || ''}
                alt={'포토리뷰'}
              />
            </div>
            {/* Empty 영역 */}
            <div className={cn(css.box, css.box_empty)} />
          </div>
        }
      />
    </>
  );
}

ModalPhotoDetail.propTypes = {
  isOpen: PropTypes.bool,
  photos: PropTypes.array,
  onClickClose: PropTypes.func,
};

export default ModalPhotoDetail;
