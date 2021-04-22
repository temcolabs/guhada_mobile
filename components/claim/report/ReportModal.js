import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import useReportState from './useReportState';
import { default as reportTargetEnum } from 'childs/lib/constant/reportTarget';
import css from './ReportModal.module.scss';
import Input from 'components/claim/report/form/Input';
import Checkbox from 'components/mypage/form/Checkbox';
import TextArea from 'components/claim/report/form/TextArea';
import Select from 'components/claim/report/Select';
import useStores from 'stores/useStores';
import SlideIn, { slideDirection } from 'components/common/panel/SlideIn';
import ModalForm, {
  ModalFormField,
  ModalFormLabel,
  ModalFormValue,
} from 'components/common/modal/modalform/ModalForm';
import ModalFormTitle from 'components/common/modal/modalform/ModalFormTitle';
import ModalFormSubmit from 'components/common/modal/modalform/ModalFormSubmit';
// import ModalFormAttachment from 'components/common/modal/modalform/ModalFormAttachment';

/**
 * 신고 모달 타이틀
 * @param {*} target
 */
const getReportModalName = (target = reportTargetEnum.BOARD) => {
  switch (target) {
    case reportTargetEnum.PRODUCT:
      return '상품';
    case reportTargetEnum.BOARD:
      return '게시글/댓글';
    case reportTargetEnum.COMMENT:
      return '게시글/댓글';
    case reportTargetEnum.USER:
      return '회원';
    case reportTargetEnum.REVIEW:
      return '리뷰';
    default:
      return '';
  }
};

/**
 * 신고하기 모달
 *
 * @param props.isOpen 표시 여부
 * @param props.reportData 신고 데이터
 * @param props.relatedData 신고 관련 관련 정보. 필드+값 객체로 구성된 배열.
 */
export default function ReportModal({
  isOpen,
  onClose,
  reportData = {
    reportTarget: reportTargetEnum.BOARD,
    targetId: null, // 게시글, 코멘트 상품 아이디
  },
  relatedData,
}) {
  const { user, report: reportStore } = useStores();
  const {
    reportState,
    handleChangeReportType,
    handleChangeTitle,
    handleChangeContent,
    handleToggleIsPrivacyAgreed,
    handleSubmitReport,
    handleChangeAttachFile,
    handleRemovedAttachedFile,
    setReportTypeOptions,
    initReportForm,
  } = useReportState({
    onCloseModal: onClose,
  });

  const { reportTarget, targetId } = reportData;
  const attachFileInputRef = React.useRef();

  // 모달이 열렸을 때 초기화
  useEffect(() => {
    if (isOpen) {
      initReportForm({
        editing: {
          reportTarget,
          targetId,
        },
        relatedData,
      });

      reportStore.getReportTypes({
        // 서버에서 데이터 가져온 후 필터링해야 한다
        onSuccess: () => {
          setReportTypeOptions(reportTarget);
        },
      });
    }
  }, [
    initReportForm,
    isOpen,
    relatedData,
    reportStore,
    reportTarget,
    setReportTypeOptions,
    targetId,
  ]);

  return (
    // <SlideIn direction={slideDirection.RIGHT} isVisible={isOpen}>
    <ModalForm isOpen={isOpen} onClose={onClose}>
      <ModalFormTitle onClose={onClose}>
        <span>{getReportModalName(reportTarget)} 신고</span>
      </ModalFormTitle>

      {/* 관련 정보 */}
      <ModalFormField>
        {/* <ModalFormLabel>
            {getReportModalName(reportTarget)} 정보
          </ModalFormLabel> */}
        <ModalFormValue>
          <div className={css.relatedInfo}>
            {reportState.relatedData?.map((data, i) => (
              <div key={i} className={css.relatedInfo__field}>
                <div className={css.relatedInfo__label}>{data.label}</div>
                <div
                  className={css.relatedInfo__value}
                  dangerouslySetInnerHTML={{ __html: data.value }}
                />
              </div>
            ))}
          </div>
        </ModalFormValue>
      </ModalFormField>

      {/* 폼 영역 */}
      {/* 신고 유형  */}
      <ModalFormField>
        {/* <ModalFormLabel>신고 유형</ModalFormLabel> */}
        <ModalFormValue>
          <Select
            placeholder="신고 유형 선택"
            options={reportState.reportTypeOptions}
            onChange={(option) => handleChangeReportType(option.value)}
            value={reportState.reportTypeOptions.find((o) =>
              _.isEqual(o.value, reportState.editing.reportType)
            )}
          />
        </ModalFormValue>
      </ModalFormField>

      {/* 제목 입력  */}
      <ModalFormField>
        {/* <ModalFormLabel>제목</ModalFormLabel> */}
        <ModalFormValue>
          <Input
            placeholder="제목을 입력해주세요"
            onChange={handleChangeTitle}
            style={{ border: 'none' }}
          />
        </ModalFormValue>
      </ModalFormField>

      <ModalFormField>
        {/* <ModalFormLabel>내용</ModalFormLabel> */}
        <ModalFormValue>
          <TextArea
            initialValue={reportState.editing.content || ''}
            placeholder="내용을 입력해주세요"
            onChange={handleChangeContent}
          />
        </ModalFormValue>
      </ModalFormField>

      <ModalFormField>
        {/* <ModalFormLabel>파일첨부</ModalFormLabel> */}
        <ModalFormValue>
          {/* <ModalFormAttachment
            onChangeFile={handleChangeAttachFile}
            imageUrls={reportState.editing?.imageUrls}
            onDeleteImage={handleRemovedAttachedFile}
          /> */}
          <div className={css.attachment}>
            <div className={css.attachment__button}>
              <input
                type="file"
                ref={attachFileInputRef}
                onChange={handleChangeAttachFile}
              />
              <button
                onClick={() => {
                  attachFileInputRef.current.click();
                }}
              />
            </div>

            <div className={css.attachment__files}>
              {reportState.editing.imageFileNames.length > 0 ? (
                reportState.editing.imageFileNames.map((filename, index) => {
                  return (
                    <div key={index} className={css.attachment__fileName}>
                      <span>{filename}</span>
                      <button
                        onClick={() => handleRemovedAttachedFile(index)}
                      />
                    </div>
                  );
                })
              ) : (
                <div>첨부파일</div>
              )}
            </div>
          </div>
        </ModalFormValue>
      </ModalFormField>

      <ModalFormField>
        {/* <ModalFormLabel>이메일</ModalFormLabel> */}
        <ModalFormValue>
          <Input
            initialValue={user.userInfo.email}
            disabled
            style={{
              border: 'none',
            }}
          />
        </ModalFormValue>
      </ModalFormField>

      <ModalFormField>
        {/* <ModalFormLabel wrapperStyle={{ letterSpacing: '-1px' }}>
            개인정보 수집동의
          </ModalFormLabel> */}
        <ModalFormValue>
          <p className={css.privacyAgreeNoti}>
            문의하시는 이메일 정보는 문의 접수 및 서비스 개선을 위해 수집하여
            5년간 보관합니다. (문의 분류에 따라 첨부된 파일 또한 수집될 수
            있습니다.)
          </p>

          <div className={css.privacyAgree}>
            <Checkbox
              name="개인정보 수집에 동의합니다."
              initialValue={false}
              onChange={handleToggleIsPrivacyAgreed}
            />
          </div>
        </ModalFormValue>
      </ModalFormField>

      <ModalFormSubmit
        cancelButtonText="취소"
        submitButtonText="신고하기"
        onCancel={onClose}
        onSubmit={handleSubmitReport}
      />
    </ModalForm>
    // </SlideIn>
  );
}
