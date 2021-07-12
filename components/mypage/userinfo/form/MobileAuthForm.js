import React, { useContext } from 'react';
import css from './UserEditForm.module.scss';
import Input, { inputStatTypes } from 'components/mypage/form/Input';
import FormButton from 'components/mypage/form/FormButton';
import { Field } from 'react-final-form';
import {
  validateWithValue,
  mustBeMobile,
} from 'lib/common/finalFormValidators';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react';
import { devLog } from 'lib/common/devLog';
import { isMobileNum } from 'lib/string/addHyphenToMobile';
import { authLocations } from 'stores/AuthMobileStore';
import ErrorMessage from 'components/mypage/form/ErrorMessage';
import { mustBeBoolean } from 'lib/common/finalFormValidators';

/**
 * nice 모바일 본인인증.
 * 본인 인증저보와 휴대폰 번호를 저장한다.
 */
export default function MobileAuthForm() {
  const { authmobile: authMobileStore, alert: alertStore } = useStores();
  const {
    fields,
    values,
    formApi,
    initialValues,
    runAfterFormInit,
    updateInitialValues,
    handleSubmitForm,
  } = useContext(UserEditFormContext);

  /**
   * 인증버튼 클릭. 모바일 인증 팝업 연다
   */
  const handleRequestMobileAuth = () => {
    // TODO: 모바일 인증코드 발송 API 호출
    if (!authMobileStore.access) {
      try {
        const childWindow = window.open('', 'popupChk');
        if (!childWindow) {
          throw new Error();
        }

        authMobileStore.getCertKey(
          authLocations.EDIT_USERINFO,
          childWindow,
          async (
            verifyParams = {
              // sample data
              birth: '1900-01-01',
              diCode: '098345oiuweroiu',
              gender: 'MALE',
              identityVerifyMethod: 'MOBILE',
              mobile: '01012341234',
              name: '구하다',
            }
          ) => {
            devLog(`verifyParams`, verifyParams);

            // NOTE: 본인인증 후 인증 데이터를 즉시 저장. UI에는 저장되었다고 알리진 않음.
            const isSuccess = await handleSubmitForm(
              {
                ...values,
                verifiedIdentity: true, // 본인인증 재인증 여부
                // 본인 인증 정보
                diCode: verifyParams.diCode,
                birth: verifyParams.birth,
                identityVerifyMethod: verifyParams.identityVerifyMethod,
                name: verifyParams.name,
                gender: verifyParams.gender,
                mobile: verifyParams.mobile,
              },
              {
                isShowAlert: false,
                isInitFormValues: false,
              }
            );

            if (isSuccess) {
              // 인증에 데이터를 폼에 저장
              formApi.change(fields.name, verifyParams.name);
              formApi.change(fields.verifiedIdentity, true);
              formApi.change(fields.diCode, verifyParams.diCode);
              formApi.change(
                fields.identityVerifyMethod,
                verifyParams.identityVerifyMethod
              );
              formApi.change(fields.name, verifyParams.name);
              // 생일, 성별을 인증받은 데이터로 업데이트한다.
              formApi.change(fields.gender, verifyParams.gender);

              // 폼 초기값 업데이트. 인증 데이터만 초기값으로 만들어준다.
              updateInitialValues({
                name: verifyParams.name,
                mobile: verifyParams.mobile,
                verifiedIdentity: true,
                diCode: verifyParams.diCode, // 본인인증 데이터 - DI 코드.
                identityVerifyMethod: verifyParams.identityVerifyMethod, // 본인인증 방법.
              });
            }
          }
        );
      } catch (e) {
        authMobileStore.access = false;
        alertStore.showAlert('브라우저 또는 구하다 앱에서 이용해주세요!');
      }
    }
  };

  return useObserver(() => (
    <>
      <div className={css.formGroup}>
        <div className={css.formInput} data-type="formButtonSize">
          <Field
            name={fields.mobile}
            validate={runAfterFormInit(validateWithValue(mustBeMobile))}
          >
            {({ input, meta }) => {
              // 휴대폰 입력값이 있고, 초기값과 다르다면
              const verifyErrorMsg =
                !values[fields.verifiedIdentity] &&
                input.value.length > 0 &&
                meta.initial !== input.value
                  ? '휴대폰 인증이 필요합니다.'
                  : undefined;

              return (
                <>
                  <Input
                    type={'number'}
                    initialValue={meta.initial}
                    onChange={(v) => {
                      let isAuthed = false;

                      // 초기값과 같고 인증받은 이메일이라면
                      if (
                        initialValues[fields.verifiedIdentity] &&
                        v === meta.initial
                      ) {
                        isAuthed = true;
                      } else {
                        isAuthed = false;
                      }

                      formApi.batch(() => {
                        formApi.change(fields.mobile, v);
                        formApi.change(fields.verifiedIdentity, isAuthed);
                      });
                    }}
                    autoComplete="off"
                    status={
                      values[fields.verifiedIdentity]
                        ? inputStatTypes.OK
                        : meta.error
                        ? inputStatTypes.ERROR
                        : inputStatTypes.NORMAL
                    }
                  />
                  {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}

                  {!meta.error && verifyErrorMsg && (
                    <ErrorMessage>{verifyErrorMsg}</ErrorMessage>
                  )}
                </>
              );
            }}
          </Field>

          {/* 본인인증 */}
          <Field name={fields.verifiedIdentity} validate={mustBeBoolean}>
            {({ input, meta }) => {
              return (
                <div>
                  {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}
                </div>
              );
            }}
          </Field>
        </div>

        {/* 인증 받기 버튼. verifiedIdentity 값을 사용한다 */}
        <div className={css.formInput}>
          <FormButton
            color="purple"
            type="button"
            onClick={handleRequestMobileAuth}
            disabled={
              // 유효한 모바일 번호가 아니니까
              !isMobileNum(values[fields.mobile]) ||
              // 초기값과 같다면
              initialValues[fields.mobile] === values[fields.mobile]
            }
          >
            {'인증 받기'}
          </FormButton>
        </div>
      </div>
    </>
  ));
}
