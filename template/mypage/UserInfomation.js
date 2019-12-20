import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import MyPageLayout from 'components/mypage/MyPageLayout';
import { inject, observer } from 'mobx-react';
import CheckPassword from 'components/mypage/userinfo/CheckPassword';
import UserEditForm from 'components/mypage/userinfo/form/UserEditForm';
import SubmitButton, {
  SubmitButtonWrapper,
  CancelButton,
} from 'components/mypage/form/SubmitButton';
import { devLog, devGroup, devGroupEnd } from 'childs/lib/common/devLog';
import { Form } from 'react-final-form';
import userService from 'childs/lib/API/user/userService';
import isTruthy from 'childs/lib/common/isTruthy';
import isDev from 'childs/lib/common/isDev';
import entryService from 'childs/lib/API/user/entryService';

// final form 관련 값들을 공유할 컨텍스트
export const UserEditFormContext = React.createContext({});

const fields = {
  name: 'name', // 이름
  nickname: 'nickname', // 닉네임

  email: 'email',
  emailAuthCode: 'emailAuthCode', // 이메일 인증코드
  isEmailAuthed: 'isEmailAuthed', // 이메일 인증 여부

  // TODO: 이메일 아이디와 도메인 분리
  emailId: 'emailId', // 이메일 아이디 입력
  emailDomain: 'emailDomain', // 이메일 도메인 입력

  mobile: 'mobile',
  mobileAuthCode: 'mobileAuthCode', // NOTE: 모바일 인증번호. 현재 nice 본인인증으로 진행해서 사용안함

  // TODO: 휴대폰은 하이픈으로 구분해서 별도로 입력받는다
  mobilePart1: 'mobilePart1',
  mobilePart2: 'mobilePart2',
  mobilePart3: 'mobilePart3',

  // 비밀번호, 비밀번호 재확인
  password: 'password',
  passwordConfirm: 'passwordConfirm',

  agreeEmailReception: 'agreeEmailReception', //email 수신 동의 여부
  agreeSmsReception: 'agreeSmsReception', //sms 수신 동의 여부

  birth: 'birth', // 생년월일
  gender: 'gender', // 성별

  // 환불 계좌정보
  bankCode: 'bankCode', // 환불 은행 코드
  bankName: 'bankName', // 환불 은행 이름
  accountNumber: 'accountNumber', // 환불 은행 계좌번호
  accountHolder: 'accountHolder', // 환불 예금주
  isAccountVerified: 'isAccountVerified', // 계좌 확인 여부

  verifiedIdentity: 'verifiedIdentity', // 재인증 여부
  diCode: 'diCode', // 본인인증 데이터 - DI 코드.
  identityVerifyMethod: 'identityVerifyMethod', // 본인인증 방법.
};

export const fieldNames = {
  name: '이름', // 이름
  nickname: '닉네임', // 닉네임

  email: '이메일',
  emailAuthCode: '이메일 인증 코드', // 이메일 인증 코드
  isEmailAuthed: '이메일 인증 여부', // 이메일 인증 여부

  // TODO: 이메일 아이디와 도메인 분리
  emailId: 'emailId', // 이메일 아이디 입력
  emailDomain: 'emailDomain', // 이메일 도메인 입력

  mobile: '휴대폰 번호',
  mobileAuthCode: '휴대폰 번호 인증 코드',

  // TODO: 휴대폰은 하이픈으로 구분해서 별도로 입력받는다
  mobilePart1: 'mobilePart1',
  mobilePart2: 'mobilePart2',
  mobilePart3: 'mobilePart3',

  // 비밀번호, 비밀번호 재확인
  password: '비밀번호',
  passwordConfirm: '비밀번호 확인',

  agreeEmailReception: 'email 수신 동의 여부', //email 수신 동의 여부
  agreeSmsReception: 'sms 수신 동의 여부', //sms 수신 동의 여부

  birth: '생년월일', // 생년월일
  gender: '성별', // 성별

  // 환불 계좌정보
  bankCode: '환불 은행 코드', // 환불 은행 코드
  bankName: '환불 은행 이름', // 환불 은행 이름
  accountNumber: '환불 은행 계좌번호', // 환불 은행 계좌번호
  accountHolder: '환불 예금주', // 환불 예금주
  isAccountVerified: '계좌 확인 여부', // 계좌 확인 여부

  verifiedIdentity: '본인인증 재인증 여부', // 본인인증 재인증 여부
  diCode: '본인인증 데이터 - DI 코드', // 본인인증 데이터 - DI 코드.
  identityVerifyMethod: '본인인증 방법', // 본인인증 방법.
};

/**
회원정보 수정-  메뉴 조회 API

사용하는 api 목록
1. POST :/users/{userId}/password -> 비밀번호 확인 api
  http://dev.user.guhada.com/swagger-ui.html#/ENTRY/verifyUserByPasswordUsingPOST
  email은 넣지 않아도 됨.

2. GET : /users -> 유저 데이터 불러오기
  http://dev.user.guhada.com/swagger-ui.html#/USER/getUsersUsingGET

3. GET : /users/user-size -> 유저 사이즈 불러오기

4. GET : /sns-users/{userId}/sns-type -> 연동된 sns 종류 불러오기

https://networksheadquarters.slack.com/archives/GJSJ4BXD1/p1570690311000300

/users/email-verify   이메일 인증하기

이메일 인증 스텝이
1. 이메일로 인증번호 요청 api
2. 인증번호 인증하기 api
3. 이메일 인증하기
인데. 1,2 에서 사용한 인증번호를 같이 보내주시면 됩니다~

 */
@inject('login', 'user', 'alert', 'authmobile')
@observer
class UserInfomation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 회원정보 수정 양식 표시 여부
      // isEditFormVisible: false,
      isEditFormVisible: false,
      isFormInitiated: false,
      initialValues: {
        ...this.defaultInitialValues,
      },
    };
  }

  // 폼 필드
  fields = fields;

  defaultInitialValues = {
    name: null,
    nickname: null,

    email: null,
    emailAuthCode: null,
    isEmailAuthed: false,

    emailId: null,
    emailDomain: null,

    mobile: '',
    mobileAuthCode: null,

    mobilePart1: null,
    mobilePart2: null,
    mobilePart3: null,
    password: null,
    passwordConfirm: null,

    agreeEmailReception: false,
    agreeSmsReception: false,

    birth: moment('2000-01-01').format('YYYY-MM-DD'), // YYYY-MM-DD
    gender: null, // MALE, FEMALE

    // 은행계좌
    bankCode: null,
    bankName: null,
    accountNumber: null,
    accountHolder: null,
    isAccountVerified: null,

    // 휴대폰 본인인증
    verifiedIdentity: false, // 본인인증 재인증 여부
    diCode: null, // 본인인증 데이터 - DI 코드.
    identityVerifyMethod: null, // 본인인증 방법.
  };

  componentDidMount() {
    this.checkEditFormVisiblity();
    this.props.user.getMySnsTypes(); // 내 SNS 타입 가져오기
  }

  /**
   * 세션 스토리지에 비밀번호 재확인 여부가 설정되어 있는지 확인하고,
   * 그렇다면 폼 데이터를 초기화한다
   */
  checkEditFormVisiblity = () => {
    const isEditFormVisible = this.props.user.isPasswordDoubleChecked();

    this.setState({ isEditFormVisible });

    if (isEditFormVisible) {
      this.initFormValues();
    }
  };

  /**
   * TODO: 회원정보 수정을 위해 폼 값 초기화
   */
  initFormValues = () => {
    const job = () => {
      const { userInfo } = this.props.user;
      // 서버에 저장된 회원정보
      const values = {
        ...this.defaultInitialValues,
        name: userInfo.name,
        nickname: userInfo.nickname,

        // TODO: ! SNS로 인증한 이메일 초기값은 이메일 형식이 아닐 수 있다. 그럴땐 빈 문자열을 넣는다
        email: userInfo.email,
        emailAuthCode: null,
        isEmailAuthed: userInfo.emailVerify,

        // emailId: null,
        // emailDomain: null,

        // 휴대폰
        mobile: userInfo.mobile || null,

        // 비밀번호
        // * 비밀번호는 null 값으로 두면 업데이트하지 않는다
        password: null,
        passwordConfirm: null,

        agreeEmailReception: userInfo.userDetail?.agreeEmailReception,
        agreeSmsReception: userInfo.userDetail?.agreeSmsReception,

        birth: userInfo.birth,
        gender: userInfo.gender,

        // 환불계좌
        bankCode: userInfo.userDetail?.bankCode,
        bankName: userInfo.userDetail?.bankName,
        accountNumber: userInfo.userDetail?.accountNumber,
        accountHolder: userInfo.userDetail?.accountHolder,

        isAccountVerified:
          isTruthy(userInfo.userDetail?.bankCode) &&
          isTruthy(userInfo.userDetail?.accountNumber) &&
          isTruthy(userInfo.userDetail?.accountHolder),

        verifiedIdentity: userInfo.userDetail.verifiedIdentity, // 본인인증 여부.
        diCode: userInfo.userDetail.diCode, // 본인인증 데이터 - DI 코드.
        identityVerifyMethod: userInfo.userDetail.identityVerifyMethod, // 본인인증 방법.
      };

      this.setState({ initialValues: values }, () => {
        this.setState({ isFormInitiated: true });
      });
    };

    this.props.user.pushJobForUserInfo(job);
  };

  updateInitialValues = values => {
    this.setState(state => ({
      initialValues: {
        ...state.initialValues,
        ...values,
      },
    }));
  };

  /**
   * 회원정보 수정
   *
   * ! 이메일은 updateUser api 대신 이메일 인증 API를 대신 사용한다.
   */
  handleSubmitForm = async (
    values = {},
    { isShowAlert = true, isInitFormValues = true } = {} // option. 생략 가능
  ) => {
    devLog(`handleSubmitForm`, values);

    try {
      // 인증된 이메일 저장
      const { userId } = this.props.user;

      const body = {
        email: values.email, // 이메일
        nickname: values.nickname, // 닉네임
        password: values.password, // 비밀번호

        bankCode: values.isAccountVerified ? values.bankCode : null, // 환불 예금주
        accountNumber: values.isAccountVerified ? values.accountNumber : null, // 환불 은행 코드
        accountHolder: values.isAccountVerified ? values.accountHolder : null, // 환불 은행 이름

        agreeEmailReception: values.agreeEmailReception, //email 수신 동의
        agreeSmsReception: values.agreeSmsReception, //sms 수신 동의

        verifiedIdentity: values.verifiedIdentity, // 본인인증 재인증 여부
        identityVerifyParam: {
          // 본인 인증 정보
          birth: values.birth,
          gender: values.gender,
          mobile: values.mobile,
          name: values.name,

          diCode: values.diCode,
          identityVerifyMethod: values.identityVerifyMethod,
        },

        // 회원 사이즈.
        inputUserSize: false, // 사이즈 입력 여부
        userSizeParam: {
          bottom: null, // 바지
          height: null, // 키
          shoe: null, // 신발
          top: null, //  XXS, XS, S, M, L, XL, XXL
          weight: null, // 키
        },
      };

      await userService.updateUser({
        userId,
        body,
      });

      if (isShowAlert) {
        this.props.alert.showAlert('회원정보가 수정되었습니다.');
      }

      // 폼 데이터를 초기화. pristine 상태가 되도록 한다.
      if (isInitFormValues) {
        await this.props.user.getUserInfo({ userId });
        this.initFormValues();
      }
      return true;
    } catch (e) {
      if (!!e.data?.message) {
        this.props.alert.showAlert(e.data?.message);
      } else {
        this.props.alert.showAlert('오류가 발생했습니다.');
      }
      console.error(e);
      return false;
    }
  };

  /**
   * 비밀번호 1회 더 확인
   */
  handleSubmitPasswordCheck = async password => {
    try {
      await entryService.loginUser({
        email: this.props.user.userInfo?.email,
        password,
      });
      this.props.user.setPasswordDoubleChecked(true);
      this.checkEditFormVisiblity();
    } catch (e) {
      const message = e.data?.message;
      const isSNSUser = this.props.user.userInfo?.userType === 'SNS';
      this.props.alert.showAlert({
        content: () => {
          return isSNSUser ? (
            <p>
              SNS를 통해 가입한 회원입니다.
              <br />
              하단의 SNS 로그인 버튼을 사용해주세요.
            </p>
          ) : (
            <p>{message || '로그인에 실패했습니다.'}</p>
          );
        },
      });
      console.error(e);
    }
  };

  printFormLog = _.debounce(formApi => {
    const { values, initialValues, errors } = formApi.getState();
    devGroup('UserInfomation');
    devLog('form values', values);
    devLog('initial values', initialValues);
    devLog('errors', errors);
    devGroupEnd('UserInfomation');
  }, 400);

  validateForm = (values = {}) => {
    const { password, passwordConfirm } = values;

    // ! 브라우저에서 비밀번호를 자동으로 입력하는 케이스가 있다.
    if ((!!password || !!passwordConfirm) && password !== passwordConfirm) {
      return {
        passwordConfirm:
          '비밀번호가 일치하지 않습니다. 비밀번호를 수정하지 않으려면 입력창을 둘 다 비워주세요.',
      };
    }
  };

  runAfterFormInit = fn => v => {
    return !this.state.isFormInitiated ? undefined : fn(v);
  };

  render() {
    return (
      <MyPageLayout topLayout={'main'} headerShape={'mypage'}>
        {/* NOTE: 개발 중에 사용하기 위해 비밀번호 확인 여부를 재설정함*/}
        {isDev && (
          <CancelButton
            onClick={() => {
              this.props.user.setPasswordDoubleChecked(false);
              this.setState({ isEditFormVisible: false });
            }}
          >
            setPasswordDoubleChecked - false
          </CancelButton>
        )}

        {this.state.isEditFormVisible ? (
          <Form
            initialValues={this.state.initialValues}
            onSubmit={this.handleSubmitForm}
            validate={this.validateForm}
            render={({ handleSubmit, form: formApi }) => {
              const { values, errors } = formApi.getState();
              this.printFormLog(formApi);

              return (
                <form onSubmit={handleSubmit} autoComplete="off">
                  <UserEditFormContext.Provider
                    value={{
                      fields: this.fields,
                      formApi,
                      values,
                      errors,

                      // * 밸리데이터에서 입력값이 변경되어야만 초기값이 적용되어 나온다.
                      // * formState에서 가져온 초기값과 실제 초기값이 달라서 생기는 오류를 방지하기 위해, state에 있는 값을 직접 전달한다
                      initialValues: this.state.initialValues,
                      updateInitialValues: this.updateInitialValues,
                      isFormInitiated: this.state.isFormInitiated,
                      runAfterFormInit: this.runAfterFormInit,
                      handleSubmitForm: this.handleSubmitForm,
                    }}
                  >
                    {/* 회원정보 수정양식 */}
                    <UserEditForm />

                    <SubmitButtonWrapper
                      wrapperStyle={{ marginTop: '60px', fontSize: '16px' }}
                    >
                      <CancelButton>취소</CancelButton>
                      <SubmitButton
                        onClick={this.handleSubmitEditForm}
                        disabled={!_.isEmpty(errors)}
                      >
                        수정
                      </SubmitButton>
                    </SubmitButtonWrapper>
                  </UserEditFormContext.Provider>
                </form>
              );
            }}
          />
        ) : (
          // 비밀번호 확인이 안되었으면 입력하게 한다
          <CheckPassword
            onSubmitPassword={this.handleSubmitPasswordCheck}
            checkEditFormVisiblity={this.checkEditFormVisiblity}
          />
        )}

        {/* 모바일 본인인증 팝업 오픈을 위한 숨겨진 폼 */}
        <form name="form_chk" method="post" style={{ display: 'none' }}>
          <input type="hidden" name="m" value="checkplusSerivce" />
          <input
            type="hidden"
            name="EncodeData"
            value={this.props.authmobile.authKey}
          />
        </form>
      </MyPageLayout>
    );
  }
}

export default UserInfomation;
