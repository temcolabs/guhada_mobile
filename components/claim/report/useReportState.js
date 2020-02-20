import { useReducer, useCallback } from 'react';
import _ from 'lodash';
import useStores from 'stores/useStores';
import { devLog, devGroup, devGroupEnd } from 'childs/lib/common/devLog';
import { isImageFile } from 'childs/lib/common/isImageFile';
import { uploadImagePath } from 'childs/lib/API/gateway/fileUploadService';

// 참조) https://dev.claim.guhada.com/swagger-ui.html#/REPORT/reportUsingPOST
const defaultEditingState = {
  reportTarget: null, // 신고 대상. 상품,게시글, 댓글, 회원 4개 중 하나
  reportType: null, // 신고 유형. API로 가져오는 20여개 객체 데이터 중 하나
  targetId: null, // 게시글이면 게시글 id, 코멘트면 코멘트 id, 회원 id, ...
  title: null, // 신고양식  입력 제목
  content: null, // 신고양식 내용
  imageUrls: [], // 신고양식 첨부 이미지 URL 배열. 이미지 업로드 후
  imageFileNames: [],
};

const initialState = {
  // 신고 API에 사용할 데이터
  editing: _.cloneDeep(defaultEditingState),
  initial: _.cloneDeep(defaultEditingState),
  isPrivacyAgreed: false, // 개인정보 수집 동의
  reportTypeOptions: [], // 신고 유형 옵션. API 연동
  relatedData: [], // 신고 대상 관련 정보. array of { label, value }
};

// types of dispatch
const types = {
  UPDATE_STATE: 'UPDATE_STATE',
  UPDATE_EDITING: 'UPDATE_EDITING',
  UPDATE_REPORT_OPTIONS: 'UPDATE_REPORT_OPTIONS',
  INIT_FORM: 'INIT_FORM',
};

/**
 * 빈 객체, 빈 배열은 병합하지 않고 그대로 대체한다
 */
const doNotJustMerge = (objValue, srcValue) => {
  // 배열은 받은 것 그대로 대체
  if (_.isArray(objValue)) {
    return srcValue;
  }

  // 빈 객체를 받았으면 그대로 대체
  if (!!srcValue && Object.keys(srcValue).length === 0) {
    return srcValue;
  }
};

/**
 * 신고 모달에서 사용할 상태 관리 커스텀 훅
 * @param {*} param0
 */
export default function useReportState({
  isModalOpen = false,
  onCloseModal = () => {},
} = {}) {
  const { report: reportStore, alert } = useStores();

  const reportReducer = (state = {}, action = {}) => {
    const { type, payload } = action;

    devGroup(`reportReducer`);
    devLog(`action:`, type, payload);

    let newState = Object.assign({}, state);

    switch (type) {
      // 전체 state 업데이트
      case types.UPDATE_STATE:
        newState = _.mergeWith({}, state, payload, doNotJustMerge);
        break;

      // 신고 양식 초기화
      case types.INIT_FORM:
        const { editing, relatedData } = payload;
        newState = _.mergeWith(
          {},
          state,
          {
            editing: _.merge({}, defaultEditingState, editing),
            initial: _.merge({}, defaultEditingState, editing),
            isPrivacyAgreed: false,
            relatedData,
          },
          doNotJustMerge
        );
        break;

      // 입력 폼 데이터 업데이트
      case types.UPDATE_EDITING:
        newState = _.mergeWith(
          {},
          state,
          {
            editing: payload,
          },
          doNotJustMerge
        );
        break;

      default:
        break;
    }

    devLog(`newState`, newState);
    devGroupEnd(`reportReducer`);

    return newState;
  };

  const [reportState, dispatch] = useReducer(reportReducer, initialState);

  /**
   * 전달받은 객체로 report state 병합
   * @param {*} payload
   */
  const updateState = useCallback(
    (payload = {}) =>
      dispatch({
        type: types.UPDATE_STATE,
        payload,
      }),
    []
  );

  /**
   * 원하는 값으로 신고 입력 데이터 초기화
   * 파라미터가 없으면 전달하지 않으면 기본값으로 초기화
   * @param {*} editingState
   */
  const initReportForm = useCallback(
    ({ editing = {}, relatedData = [] } = {}) => {
      dispatch({
        type: types.INIT_FORM,
        payload: {
          editing,
          relatedData,
        },
      });
    },
    []
  );

  const updateEditingState = useCallback(editingState => {
    dispatch({
      type: types.UPDATE_EDITING,
      payload: editingState,
    });
  }, []);

  const updateEditingFactory = useCallback(
    key =>
      _.debounce(value => {
        dispatch({
          type: types.UPDATE_EDITING,
          payload: {
            [key]: value,
          },
        });
      }, 200),
    []
  );

  /**
   * 입력 필드별 업데이트 콜백
   */
  const handleChangeReportTarget = useCallback(
    updateEditingFactory('reportTarget'),
    []
  );
  const handleChangeReportType = useCallback(
    updateEditingFactory('reportType'),
    []
  );
  const handleChangeTargetId = useCallback(
    updateEditingFactory('targetId'),
    []
  );
  const handleChangeTitle = useCallback(updateEditingFactory('title'), []);
  const handleChangeContent = useCallback(updateEditingFactory('content'), []);
  const handleChangeImageUrls = useCallback(
    updateEditingFactory('imageUrls'),
    []
  );
  const handleToggleIsPrivacyAgreed = useCallback(() => {
    updateState({
      isPrivacyAgreed: !reportState.isPrivacyAgreed,
    });
  }, [reportState.isPrivacyAgreed, updateState]);

  /**
   * 첨부파일 선택
   */
  const handleChangeAttachFile = async e => {
    const { files } = e.target;

    const uploadFile = files[0];

    if (isImageFile(uploadFile)) {
      try {
        uploadImagePath({
          file: uploadFile,
          uploadPath: '/user/temp`', // TODO: CLAIM /users/report/image-upload-url 에서 업로드 경로를 가져오도록 수정
        }).then(({ url }) => {
          // 이미지 경로. 파일명 추가
          updateEditingState({
            imageUrls: [url].concat(reportState.editing?.imageUrls),
            imageFileNames: [uploadFile.name].concat(
              reportState.editing.imageFileNames
            ),
          });
        });
      } catch (e) {
        alert.showAlert('이미지 파일만 첨부 가능합니다.');
        console.error(e);
      }
    }
  };

  /**
   * 첨부 파일 제거
   * @param {} index
   */
  const handleRemovedAttachedFile = (index = 0) => {
    // make copy
    const imageUrls = reportState.editing?.imageUrls.slice();
    const imageFileNames = reportState.editing.imageFileNames.slice();

    // remove target index
    imageUrls.splice(index, 1);
    imageFileNames.splice(index, 1);

    // update
    updateEditingState({
      imageUrls,
      imageFileNames,
    });
  };

  /**
   * 신고 양식 제출
   */
  const handleSubmitReport = () => {
    if (reportState.isPrivacyAgreed) {
      reportStore.createReport({
        params: reportState.editing,
        onSuccess: () => {
          onCloseModal();
        },
      });
    } else {
      alert.showAlert('개인정보 수집에 동의해야 합니다.');
    }
  };

  // 신고 유형 옵션 업데이트
  const setReportTypeOptions = useCallback(
    reportTarget => {
      const options = reportStore.getReportTypeOptions(reportTarget);

      updateState({
        reportTypeOptions: options,
        editing: {
          reportType: null,
        },
      });
    },
    [reportStore, updateState]
  );

  return {
    reportState,
    updateState,
    updateEditingState,
    initReportForm,
    handleChangeReportTarget,
    handleChangeReportType,
    handleChangeTargetId,
    handleChangeTitle,
    handleChangeContent,
    handleChangeImageUrls,
    handleToggleIsPrivacyAgreed,
    handleSubmitReport,
    handleChangeAttachFile,
    handleRemovedAttachedFile,
    setReportTypeOptions,
  };
}
