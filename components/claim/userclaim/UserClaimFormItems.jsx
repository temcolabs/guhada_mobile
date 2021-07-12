import css from './UserClaimFormItems.module.scss';
import { Field } from 'react-final-form';
import Message from './Message';
import Select from 'components/mypage/form/Select';
import Input from 'components/mypage/form/Input';
import TextArea from 'components/mypage/form/TextArea';
import Checkbox from 'components/mypage/form/Checkbox';
import Text from 'components/mypage/form/Text';
import SubmitButton, {
  SubmitButtonWrapper,
  CancelButton,
} from 'components/mypage/form/SubmitButton';
import {
  composeValidators,
  required,
  notEmptyString,
} from 'lib/common/finalFormValidators';

const UserClaimFormItemsWithProps = (props) => {
  const {
    fields,
    attachFileInputRef,
    handleClose,
    handleChangeImageFile,
    handleDeleteImageFile,
    getCodeOptionOfCategory,
  } = props;

  return ({
    handleSubmit,
    form: formApi,
    initialValues,
    store: { user: userStore, userClaim: userClaimStore },
  }) => {
    const { values } = formApi.getState();

    return (
      <section className={css.wrap}>
        <header className={css.header}>
          <div
            className={css.header__backIcon}
            onClick={() => handleClose(formApi)}
          />
          <div className={css.header__text}>문의하기</div>
        </header>
        <form className={css.form} onSubmit={handleSubmit}>
          <div className={css.form__wrapper}>
            {/* 헤더 메시지 */}
            <Message />

            {/* 문의 유형 */}
            <Field
              name={fields.claimCategoryCode}
              validate={composeValidators(required)}
            >
              {(props) => (
                <div className={props.meta.submitFailed ? css.form__error : ''}>
                  <Select
                    placeholder={
                      (props.meta.submitFailed && props.meta.error) ||
                      '문의 유형을 선택해주세요'
                    }
                    options={userClaimStore.userClaimCategoryOptions}
                    value={userClaimStore.userClaimCategoryOptions?.find(
                      (o) => o.value === props.input.value
                    )}
                    onChange={({ value }) => {
                      formApi.change(fields.typeCode, null);
                      userClaimStore.handleChangeClaimCategory(value);
                      props.input.onChange(value);
                    }}
                  />
                </div>
              )}
            </Field>

            {/* 상세 유형 */}
            <Field
              name={fields.typeCode}
              validate={composeValidators(required)}
            >
              {(props) => {
                const optionSelected = getCodeOptionOfCategory({
                  formApi,
                  input: props.input,
                  values,
                });

                return (
                  <div
                    className={props.meta.submitFailed ? css.form__error : ''}
                  >
                    <Select
                      placeholder={
                        (props.meta.submitFailed && props.meta.error) ||
                        '상세 유형을 선택해주세요'
                      }
                      options={userClaimStore.userClaimCodeOptions}
                      onChange={({ value }) => {
                        props.input.onChange(value);
                      }}
                      value={optionSelected}
                      isDisabled={!formApi.getState().values.claimCategoryCode}
                    />
                  </div>
                );
              }}
            </Field>

            {/* 제목 */}
            <Field
              name={fields.title}
              validate={composeValidators(required, notEmptyString)}
            >
              {(props) => (
                <div className={props.meta.submitFailed ? css.form__error : ''}>
                  <Input
                    placeholder={
                      (props.meta.submitFailed && props.meta.error) ||
                      '제목을 입력해주세요'
                    }
                    initialValue={initialValues[fields.title] || ''}
                    onChange={props.input.onChange}
                  />
                </div>
              )}
            </Field>

            {/* 내용 */}
            <Field
              name={fields.content}
              validate={composeValidators(required, notEmptyString)}
            >
              {(props) => (
                <div className={props.meta.submitFailed ? css.form__error : ''}>
                  <TextArea
                    placeholder={
                      (props.meta.submitFailed && props.meta.error) ||
                      '내용을 입력해주세요'
                    }
                    initialValue={initialValues[fields.content] || ''}
                    onChange={props.input.onChange}
                    inputSizePosition="BOTTOM_RIGHT"
                  />
                </div>
              )}
            </Field>

            {/* 이미지 */}
            <Field name={fields.imageUrls}>
              {(props) => (
                <div className={css.image}>
                  <div
                    className={css.image__header}
                    onClick={() => attachFileInputRef.current.click()}
                  >
                    <span className={css.image__header__icon} />
                    <span className={css.image__header__text}>첨부파일</span>
                  </div>
                  {props.input.value?.length > 0 && (
                    <div className={css.image__container}>
                      {props.input.value.map((image, index) => {
                        return (
                          <div
                            key={image.fileName}
                            className={css.image__item}
                            style={{
                              backgroundImage: `url(${image.url})`,
                            }}
                          >
                            <button
                              onClick={() =>
                                handleDeleteImageFile({
                                  index,
                                  formApi,
                                })
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* hidden input */}
                  <input
                    style={{ display: 'none' }}
                    type="file"
                    ref={attachFileInputRef}
                    onChange={(e) =>
                      handleChangeImageFile({
                        files: e.target.files,
                        formApi,
                        imageUrls: props.input.value,
                      })
                    }
                  />
                  {props.meta.submitFailed && (
                    <div data-name="error">{props.meta.error}</div>
                  )}
                </div>
              )}
            </Field>

            {/* 이메일 */}
            <Input
              placeholder="이메일을 입력해주세요"
              initialValue={userStore.userInfo?.email}
              disabled
            />

            {/* 동의사항 */}
            <div className={css.form__agree}>
              <Text wrapperStyle={{ fontSize: '12px' }}>
                문의하시는 이메일 정보는 문의 접수 및 서비스 개선을 위해
                수집하여 5년간 보관합니다. <br />
                (문의 분류에 따라 첨부된 파일 또한 수집될 수 있습니다.)
              </Text>
              <Field name={fields.isAgreed}>
                {(props) => (
                  <div>
                    <Checkbox
                      name="privacyagreement"
                      onChange={props.input.onChange}
                    >
                      개인정보수집에 동의합니다.
                    </Checkbox>
                    {!values.isAgreed && props.meta.modified && (
                      <div data-name="error">이 값은 필수입니다.</div>
                    )}
                  </div>
                )}
              </Field>
            </div>
          </div>
          {/* 제출 버튼 */}
          <SubmitButtonWrapper
            fixedToBottom
            wrapperStyle={{ position: 'absolute', bottom: 0 }}
          >
            <CancelButton onClick={() => handleClose(formApi)}>
              취소
            </CancelButton>
            <SubmitButton disabled={!values.isAgreed}>문의하기</SubmitButton>
          </SubmitButtonWrapper>
        </form>
      </section>
    );
  };
};

export default UserClaimFormItemsWithProps;
