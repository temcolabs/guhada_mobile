import React, { useContext } from 'react';
import css from './ProfileImageForm.module.scss';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react';
import { isImageFile } from 'lib/common/isImageFile';
import {
  uploadProfileFile,
  deleteProfileFile,
} from 'lib/API/user/profileService';
import cn from 'classnames';
export default function ProfileImageForm() {
  const { user: userStore, alert: alertStore } = useStores();
  const { fields, values, updateInitialValues } = useContext(
    UserEditFormContext
  );
  const attachFileInputRef = React.useRef();

  const handleChangeAttachFile = async (e) => {
    const { files } = e.target;

    const uploadFile = files[0];

    if (isImageFile(uploadFile)) {
      try {
        uploadProfileFile({
          file: uploadFile,
          userId: userStore.userId,
        }).then(({ data }) => {
          updateInitialValues({
            profileImageUrl: data,
          });
          userStore.getUserInfo({ userId: userStore.userId });
        });
      } catch (e) {
        alertStore.showAlert('이미지 파일만 첨부 가능합니다.');
        console.error(e);
      }
    }
  };

  const handleRemovedAttachedFile = () => {
    try {
      deleteProfileFile({ userId: userStore.userId }).then(({ data }) => {
        updateInitialValues({
          profileImageUrl: '',
        });
        userStore.getUserInfo({ userId: userStore.userId });
      });
    } catch (e) {
      console.error(e);
    }
  };

  return useObserver(() => (
    <div>
      {!!values[fields.profileImageUrl] ? (
        <div className={css.profileWrap}>
          <div
            className={css.profile}
            style={{
              backgroundImage: `url(${values[fields.profileImageUrl]})`,
            }}
          >
            <div
              className={css.camera}
              onClick={() => {
                attachFileInputRef.current.click();
              }}
            />
          </div>
        </div>
      ) : (
        <div className={css.profileWrap}>
          <div className={cn(css.profile, css.empty)}>
            <div
              className={css.camera}
              onClick={() => {
                attachFileInputRef.current.click();
              }}
            />
          </div>
        </div>
      )}
      <div className={css.profileTextWrap}>
        <input
          type="file"
          ref={attachFileInputRef}
          onChange={handleChangeAttachFile}
        />

        {!!values[fields.profileImageUrl] && (
          <div
            className={css.profileText}
            onClick={() => {
              handleRemovedAttachedFile();
            }}
          >
            프로필 삭제
          </div>
        )}
      </div>
    </div>
  ));
}
