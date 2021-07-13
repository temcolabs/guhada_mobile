import { useState, useCallback, useContext, useEffect } from 'react';
import css from './UserEditForm.module.scss';
import Input, { inputStatTypes } from 'components/mypage/form/Input';
import FormButton, {
  formButtonColors,
} from 'components/mypage/form/FormButton';
import CountdownTimer from 'components/head/CountdownTimer';
import { Field } from 'react-final-form';
import {
  composeValidators,
  mustBeEmail,
  mustBeBoolean,
  mustBeTrue,
} from 'lib/common/finalFormValidators';
import debouncePromise from 'lib/common/debouncePromise';
import userService from 'lib/API/user/userService';
import notificationService from 'lib/API/user/notificationService';
import { UserEditFormContext } from 'template/mypage/UserInfomation';
import useStores from 'stores/useStores';
import { useObserver } from 'mobx-react';
import verifyService from 'lib/API/user/verifyService';
import { devLog } from 'lib/common/devLog';
import ErrorMessage from 'components/mypage/form/ErrorMessage';

export default function EmailVerifyForm() {
  const { user: userStore, alert: alertStore } = useStores();
  const {
    fields,
    values,
    errors,
    formApi,
    initialValues,
    updateInitialValues,
    runAfterFormInit,
  } = useContext(UserEditFormContext);

  const [
    isResendEmailAuthButtonVisible,
    setIsResendEmailAuthButtonVisible,
  ] = useState(false);

  const [
    isEmailAuthCodeInputVisible,
    setIsEmailAuthCodeInputVisible,
  ] = useState(false);

  const [initialTimeLeft, setInitialTimeLeft] = useState(-1);

  // 마지막 입력값. 밸리데이션 중복 실행을 방지
  const [lastValue, setLastValue] = useState(null);

  const checkIsEmailDup = useCallback(
    debouncePromise(async (email) => {
      return await userService.isEmailExist({ email });
    }, 300),
    []
  );

  /**
   * 인증메일 전송
   */
  const sendEmailToVerify = useCallback(() => {
    setInitialTimeLeft(-1);

    notificationService
      .sendEmailToVerify({
        body: {
          email: values[fields.email],
          name: userStore.userInfo?.name,
        },
      })
      .then(() => {
        setInitialTimeLeft(600);
        formApi.change(fields.isEmailAuthed, false); //  인증 여부 무효화

        setIsResendEmailAuthButtonVisible(true); // 재전송
        setIsEmailAuthCodeInputVisible(true); // 인증코드 입력
      })
      .catch(() => {
        alertStore.showAlert('인증메일 발송에 실패했습니다.');
      });
  }, [
    alertStore,
    fields.email,
    fields.isEmailAuthed,
    formApi,
    userStore.userInfo,
    values,
  ]);

  /**
   * 코드입력 타임오버
   */
  const handleEmailAuthTimeover = useCallback(() => {
    setIsEmailAuthCodeInputVisible(false);
    formApi.resetFieldState(fields.isEmailAuthed);
    formApi.resetFieldState(fields.email);
  }, [fields.email, fields.isEmailAuthed, formApi]);

  /**
   * 이메일 인증번호 제출
   */
  const handleSubmitEmailAuthCode = useCallback(() => {
    verifyService
      .verifyCode({
        body: {
          verificationNumber: values[fields.emailAuthCode],
          verificationTarget: values[fields.email],
          verificationTargetType: 'EMAIL',
        },
      })
      .then((res) => {
        userService
          .emailVerify({
            verificationNumber: values.emailAuthCode,
            email: values[fields.email],
          })
          .then(() => {
            devLog('이메일 인증성공');
            setInitialTimeLeft(-1); // 타이머 멈춤

            setIsEmailAuthCodeInputVisible(false);
            setIsResendEmailAuthButtonVisible(false);

            // 초기값 업데이트.
            // NOTE: 이메일이 인증되면 서버에 이메일이 저장되기 때문.
            updateInitialValues({
              [fields.email]: values[fields.email],
              [fields.isEmailAuthed]: true,
              [fields.emailAuthCode]: '',
            });
          })
          .catch((e) => {
            alertStore.showAlert('유효하지 않은 코드입니다.');
          });
      })
      .catch(({ data }) => {
        if (data.data?.resultCode === 6004) {
          alertStore.showAlert('유효시간 경과, 다시 발급받으세요');
          formApi.change(fields.isEmailAuthed, false);
        } else {
          alertStore.showAlert('유효하지 않은 코드입니다.');
          formApi.change(fields.isEmailAuthed, false);
        }
      });
  }, [
    alertStore,
    fields.email,
    fields.emailAuthCode,
    fields.isEmailAuthed,
    formApi,
    updateInitialValues,
    values,
  ]);

  // 인증메일 발송 필요 여부
  const isSendEmailRequired =
    !errors[fields.email] && !values[fields.isEmailAuthed];

  const validator = useCallback(
    runAfterFormInit(
      composeValidators(mustBeEmail, async (v) => {
        if (lastValue !== v) {
          if (initialValues[fields.email] === v) {
            return undefined;
          } else {
            if (await checkIsEmailDup(v)) {
              return '이미 사용중인 이메일입니다.';
            } else {
              return undefined;
            }
          }
        }
      })
    ),
    [lastValue]
  );

  const onChange = useCallback(
    (v, meta) => {
      const email = v;
      let isEmailAuthed = null;

      // 초기값과 같고 인증받은 이메일이라면
      if (initialValues[fields.isEmailAuthed] && v === meta.initial) {
        isEmailAuthed = true;
      } else {
        // 변경되었다면 인증 해제
        isEmailAuthed = false;
      }

      formApi.batch(() => {
        formApi.change(fields.email, email);
        formApi.change(fields.isEmailAuthed, isEmailAuthed);
      });

      setLastValue(v);
    },
    [fields.email, fields.isEmailAuthed, formApi, initialValues]
  );

  // setLastValue 최초 1회 실행
  useEffect(() => {
    setLastValue(initialValues[fields.email]);
    return () => {};
  }, [fields.email, initialValues]);

  return useObserver(() => (
    <div>
      <div className={css.formGroup}>
        <div className={css.formInput} data-type="formButtonSize">
          {/* 이메일 입력 필드 */}
          <Field name={fields.email} validate={validator}>
            {({ meta, input }) => {
              return (
                <>
                  <input
                    type="text"
                    name="hidden"
                    style={{ display: 'none' }}
                  />
                  <Input
                    initialValue={meta.initial}
                    onChange={(v) => onChange(v, meta)}
                    status={
                      // 인증 번호를 입력해서 인증 받은 상태라면 보라색 체크표시
                      values[fields.isEmailAuthed]
                        ? inputStatTypes.OK
                        : meta.error
                        ? inputStatTypes.ERROR
                        : inputStatTypes.NORMAL
                    }
                    autoComplete="off"
                  />
                  {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}
                </>
              );
            }}
          </Field>

          {/* 이메일 인증 여부 */}
          <Field
            name={fields.isEmailAuthed}
            validator={runAfterFormInit(
              composeValidators(
                mustBeBoolean,
                mustBeTrue('이메일 인증이 필요합니다.')
              )
            )}
          >
            {({ input, meta }) => {
              return meta.dirty && meta.error ? (
                <ErrorMessage>{meta.error}</ErrorMessage>
              ) : null;
            }}
          </Field>
        </div>

        <div className={css.formInput}>
          <FormButton
            type="button"
            onClick={() => sendEmailToVerify()}
            color={
              isSendEmailRequired
                ? formButtonColors.PURPLE
                : formButtonColors.DEFAULT
            }
            disabled={!isSendEmailRequired}
          >
            {values[fields.isEmailAuthed]
              ? '인증 완료'
              : isResendEmailAuthButtonVisible
              ? '재전송'
              : '인증받기'}
          </FormButton>
        </div>
      </div>
      {/* 이메일 인증코드 입력 */}
      {isEmailAuthCodeInputVisible && (
        <Field name={fields.emailAuthCode}>
          {({ meta, input }) => (
            <div className={css.formGroup}>
              <div className={css.formInput} data-type="emailAuthCode">
                <Input initialValue={meta.initial} onChange={input.onChange}>
                  <span className={css.mobileAuthTimer}>
                    {/* 카운트다운 타이머 */}
                    <CountdownTimer
                      isVisible={isEmailAuthCodeInputVisible}
                      initialTimeLeft={initialTimeLeft}
                      render={({ time }) => {
                        return <span>{time}</span>;
                      }}
                      onTimeOver={() =>
                        handleEmailAuthTimeover({ formApi, fields, values })
                      }
                    />
                  </span>
                </Input>
              </div>

              <div className={css.formInput}>
                <FormButton
                  type="button"
                  onClick={() => handleSubmitEmailAuthCode()}
                  disabled={!input.value}
                >
                  인증 받기
                </FormButton>
              </div>
            </div>
          )}
        </Field>
      )}
      {/* 인증이 완료되면  */}
      {/* <div className={css.formInput}>
            <Field
              name={fields.isEmailAuthed}
              validate={composeValidators(mustBeTrue)}
            >
              {({ meta, input }) => {
                return (
                  <FormButton
                    type="button"
                    onClick={() => handleSubmitEmailAuthCode()}
                    disabled={}
                  >
                    인증 받기
                  </FormButton>
                );
              }}
            </Field>
          </div>
        </div> */}
    </div>
  ));
}
