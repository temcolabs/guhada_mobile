import React, { useState, useEffect } from 'react';
import css from './CommentInput.module.scss';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react';
import useChangeInput from 'hooks/useChangeInput';
import { uploadImageFile } from 'childs/lib/API/gateway/fileUploadService';
import { sendBackToLogin } from 'childs/lib/router';

export default function CommentInput({
  commentId = 0,
  isUpdate = false,
  wrapperStyle = {},
  onSubmitComment = ({ contents = '', imageList = [] }) => {},
  initialContents,
  initialImageList, // Array
}) {
  const { login, alert } = useStores();
  const {
    value: contents,
    handleChange: handleChangeContents,
  } = useChangeInput({
    initialValue: isUpdate ? initialContents : '',
  });

  const [atthcedImages, setAttachedImages] = useState([]);

  // 댓글 수정일 때 이미지 목록 적용
  useEffect(() => {
    if (isUpdate) {
      setAttachedImages(initialImageList);
    }
    return () => {
      if (isUpdate) {
        setAttachedImages([]);
      }
    };
  }, [initialImageList, isUpdate]);

  const handleSubmit = async (e) => {
    if (!login.isLoggedIn) {
      sendBackToLogin();
    } else {
      try {
        e.preventDefault();

        await onSubmitComment({
          contents,
          imageList: atthcedImages,
        });

        // 입력 초기화
        handleChangeContents('');
        setAttachedImages([]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleClickForm = () => {
    if (!login.isLoggedIn) {
      sendBackToLogin();
    }
  };

  /**
   * 첨부파일 선택
   * @param {*} e
   */
  const handleChangeAttachFileInput = async (e) => {
    if (atthcedImages.length >= 1) {
      alert.showAlert('이미지는 1개까지 첨부 가능합니다.');
    } else {
      try {
        const imageData = await uploadImageFile({
          file: e.target.files[0],
          uploadPath: ['COMMUNITY', 'BBS'],
        });

        setAttachedImages([...atthcedImages, imageData]);
      } catch (e) {
        alert.showAlert('파일 업로드에 실패했습니다');
        console.error(e);
      }
    }
  };

  const handleDeleteImage = (index) => {
    setAttachedImages((list) => {
      const copiedList = list.slice();
      copiedList.splice(index, 1);
      return copiedList;
    });
  };

  // login.isLoggedIn &&
  return useObserver(() => (
    <form onSubmit={handleSubmit} onClick={handleClickForm}>
      <div className={css.inputBox}>
        <input
          className={css.inputBox_input}
          placeholder="댓글을 입력해주세요."
          value={contents || ''}
          onChange={(e) => handleChangeContents(e.target.value)}
        />
        <button type="submit" className={css.inputBox_registerButton}>
          <span>{isUpdate ? '수정' : '등록'}</span>
        </button>

        <div className={css.attach}>
          <input
            id={`${commentId}_fileinput`}
            type="file"
            style={{ display: 'none' }}
            onChange={handleChangeAttachFileInput}
          />
          <label
            htmlFor={`${commentId}_fileinput`}
            className={css.attach_photoButton}
          />
        </div>
      </div>
      {atthcedImages.length > 0 && (
        <div className={css.attachedImages}>
          {atthcedImages.map(({ url }, index) => {
            return (
              <div
                className={css.imagePreview}
                style={{
                  backgroundImage: `url(${url})`,
                }}
              >
                <button
                  type="button"
                  className={css.deleteImageButton}
                  onClick={() => handleDeleteImage(index)}
                />
              </div>
            );
          })}
        </div>
      )}
    </form>
  ));
}
