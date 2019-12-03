import React, { useRef } from 'react';
import css from './ModalForm.module.scss';
import { devLog } from 'childs/lib/common/devLog';
/**
 * 파일첨부 영역
 */
export default function ModalFormAttachment({
  onDeleteImage = index => {},
  imageUrls = [], //  이미지 url 배열
  onChangeFile = e => devLog(e.target?.files), // 이미지 선택 이벤트 콜백
}) {
  // 첨부파일 input ref
  const attachFileInputRef = useRef();

  return (
    <div className={css.fileAttachment}>
      <button
        className={css.fileAttachment__photoButton}
        onClick={() => {
          attachFileInputRef.current.click();
        }}
        type="button"
      >
        첨부파일
      </button>

      <input
        style={{ display: 'none' }}
        type="file"
        ref={attachFileInputRef}
        onChange={onChangeFile}
      />

      <div className={css.fileAttachment__imageWrapper}>
        {imageUrls.map((imageUrl, index) => {
          return (
            <div
              className={css.fileAttachment__image}
              style={{ backgroundImage: `url(${imageUrl})` }}
            >
              <button
                type="button"
                className={css.fileAttachment__deleteImageButton}
                onClick={() => onDeleteImage(index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
