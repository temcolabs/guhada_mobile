import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { observer } from 'mobx-react';
import useStores from 'stores/useStores';

import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import withAuth from 'components/common/hoc/withAuth';
import UserClaimFormItems from './UserClaimFormItems';

import { Form } from 'react-final-form';
import { isImageFile } from 'childs/lib/common/isImageFile';
import { uploadImageFile } from 'childs/lib/API/gateway/fileUploadService';

/**
 * 문의하기 모달
 */
function UserClaimModal({ setUserClaimModalOpen }) {
  /**
   * initial values
   */
  const fields = useMemo(
    () => ({
      claimCategoryCode: 'claimCategoryCode', // 클레임 카테고리 코드
      typeCode: 'typeCode', // 클레임 타입 코드
      title: 'title', // 제목
      content: 'content', // 내용
      imageUrls: 'imageUrls', // 첨부이미지 배열 Array of { fileName: string, url: string }
      isAgreed: 'isAgreed', // 개인정보 동의 여부
    }),
    []
  );
  const defaultFormValues = useMemo(
    () => ({
      claimCategoryCode: null,
      typeCode: null,
      title: '',
      content: '',
      imageUrls: [],
      isAgreed: false,
    }),
    []
  );

  /**
   * states
   */
  const attachFileInputRef = useRef(); // 첨부파일 input ref

  const rootStore = useStores();
  const { userClaim: userClaimStore, alert: alertStore } = rootStore;

  const [initialValues, setInitialValues] = useState(defaultFormValues);
  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * side effects
   */
  useEffect(() => {
    setIsModalVisible(true);
  });
  useEffect(() => {
    userClaimStore.getUserClaimTypes();

    return () => {
      setInitialValues(defaultFormValues);
    };
  }, [userClaimStore, userClaimStore.userClaimTypes, defaultFormValues]);

  /**
   * handlers
   */
  const handleClose = (formApi) => {
    // if (formApi.getState().dirty) {
    alertStore.showConfirm({
      content: '작성중인 항목이 있습니다. 취소하시겠습니까?',
      onConfirm: () => {
        setUserClaimModalOpen(false);
      },
    });
  };

  const handleSubmit = useCallback(
    (values) => {
      userClaimStore
        .createUserClaim({
          body: {
            title: values[fields.title],
            content: values[fields.content],
            imageUrls: values[fields.imageUrls].map((image) => image.url),
            typeCode: values[fields.typeCode],
          },
        })
        .then(() => {
          alertStore.showConfirm({
            content: '문의가 등록되었습니다.',
            onConfirm: () => {
              setUserClaimModalOpen(false);
            },
          });
        });
    },
    [
      fields.content,
      fields.imageUrls,
      fields.title,
      fields.typeCode,
      userClaimStore,
      setUserClaimModalOpen,
      alertStore,
    ]
  );

  // 이미지 파일 첨부
  const handleChangeImageFile = ({ files, formApi, imageUrls }) => {
    if (files && isImageFile(files[0])) {
      uploadImageFile({
        file: files[0],
        uploadPath: ['USER_CLAIM'],
      })
        .then(({ url, fileName }) => {
          formApi.change(
            fields.imageUrls,
            imageUrls.concat([
              {
                fileName,
                url,
              },
            ])
          );
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  // 첨부 이미지 제거
  const handleDeleteImageFile = ({ index, formApi }) => {
    const newImageUrls = formApi.getState().values?.imageUrls.slice();
    newImageUrls.splice(index, 1);
    formApi.change(fields.imageUrls, newImageUrls);
  };

  // 클레임 코드 기본값 설정
  const getCodeOptionOfCategory = ({ formApi, input, values }) => {
    const categoryCode = values[fields.claimCategoryCode];
    const codeOption =
      !!categoryCode && userClaimStore.userClaimCodeOptions?.length > 0
        ? userClaimStore.userClaimCodeOptions.find(
            (o) => o.value === input.value
          ) || userClaimStore.userClaimCodeOptions[0]
        : null;

    // 기본 코드 옵션이 업데이트되면 폼 값도 업데이트한다
    if (!!codeOption && codeOption.value !== input.value) {
      formApi.change(fields.typeCode, codeOption.value);
    }

    return codeOption;
  };

  /**
   * render
   */
  return (
    <SlideIn direction={slideDirection.RIGHT} isVisible={isModalVisible}>
      <Form
        initialValues={initialValues}
        onSubmit={handleSubmit}
        store={rootStore}
        render={UserClaimFormItems({
          fields,
          attachFileInputRef,
          handleClose,
          handleChangeImageFile,
          handleDeleteImageFile,
          getCodeOptionOfCategory,
        })}
      />
    </SlideIn>
  );
}

export default withAuth()(observer(UserClaimModal));
