import API from 'childs/lib/API';

/**
 * 회원정보 관련 API 서비스
 *
 * http://dev.user.guhada.com/swagger-ui.html#/USER
 */
export default {
  /**
   * 중복된 이메일 주소인지 번호인지 검사
   */
  isEmailExist: ({ email = '' }) => {
    return API.user
      .get(`/isEmailExist/${email}`)
      .then(() => {
        return false;
      })
      .catch(({ data }) => {
        console.error(`data`, data);
        return data.resultCode === 6001 ? true : false;
      });
  },

  /**
   * 사용자의 이메일 인증
   * 사용을 위해서는 두 단계가 진행되어 있어야 하며, 요청이 성공하면 이메일이 서버에 저장된다.
   *
   * 1. 인증메일 발송 (sendEmailToVerify) => notificationService
   * 2. 인증 코드 확인 (verify) => verifyService
   * 3. 이메일 인증 (email-verify) => 이 메소드
   */
  emailVerify: ({ verificationNumber, email }) => {
    return API.user.put(`/users/email-verify`, {
      verificationNumber,
      email,
    });
  },

  /**
   * 중복된 이메일인지 검사
   */
  isMobileExist: ({ mobile = '' }) => {
    return API.user.get(`/isMobileExist/${mobile}`);
  },

  /**
   * 닉네임으로 회원정보를 가져와서 중복인지 검사
   * then 블럭에서는 회원정보 존재함. catch 블럭에서는 회원정보 없음 관련 동작 실행
   */
  isNicknameExist: ({ nickname }) => {
    return API.user
      .get(`/users/nickname/${nickname}`)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  },

  /**
   * 회원정보 가져오기.
   * updateUser에 넣는 body 객체와 결과가 다르다.
   * 네트워크 탭에서 직접 확인 필요.
   */
  getUser: ({ userId } = {}) => {
    return API.user.get(`/users/${userId}`);
  },

  /**
   * 회원 정보 수정하기
    PUT /users/{userId}  (회원정보 수정)

    ---

    유저의 사이즈 데이터 UserSizeParam 과 본인인증 데이터 IdentityVerifyParam 을 제외한 나머지 정보는 전부 필수 입니다. 넘어온 값을 update 합니다.

    유저 사이즈, 본인 인증 데이터는 다음의 boolean 값을 바라보며 업데이트 여부를 결정합니다.

    유저 사이즈 데이터는 inputUserSize : false 일 경우 업데이트 안함.
    본인인증 데이터는 verifiedIdentity :  : false 일 경우 업데이트 안함.

    https://networksheadquarters.slack.com/archives/GJSJ4BXD1/p1571103224006500
   */
  updateUser: ({
    userId,
    body = {
      // ============================================================
      // 필수

      email: 'youngilpark@temco.io', // 이메일. 인증과정에서 자동으로 저장되지만 PUT 호출에도 넣어준다.
      nickname: '울트라맨', // 업데이트 전 중복 여부 확인 필요
      password: null, // 비밀번호 유효성 검사 필요. null을 보내면 바뀌지 않는다.

      bankCode: '005', // 환불 은행 코드
      bankName: '외환은행', // 환불 은행 이름
      accountHolder: '박영일', // 환불 예금주
      accountNumber: '0101001', // 계좌번호

      agreeEmailReception: true, // email 수신 동의
      agreeSmsReception: false, // sms 수신 동의

      // ============================================================
      // 옵션

      verifiedIdentity: true, // 본인인증 재인증 여부. false면 identityVerifyParam이 필수가 아니다.
      // * false 라면 수수정된 사항 제외하고 서버에 있는 데이터 다시 그대로 보내야 함.
      identityVerifyParam: {
        // 본인 인증 정보
        birth: '1985-01-24',
        diCode: 'DOVm2WEO8m3omlSXll',
        gender: 'MALE', // MALE, FEMALE
        identityVerifyMethod: 'MOBILE', // NONE, MOBILE
        mobile: '01094342999',
        name: '박영일',
      },

      // * 신체 사이즈는 모달에서 별도로 API를 호출하며 모달을 닫는 순간 데이터가 저장된다.
      // * 이 API에 데이터를 저장할 필요는 굳이 없음.
      inputUserSize: true, // 사이즈 입력 여부. false면 userSizeParam이 필수가 아니다.
      userSizeParam: {
        bottom: null, // 바지
        height: null, // 키
        shoe: null, // 신발
        top: null, //  XXS, XS, S, M, L, XL, XXL
        weight: null, // 키
      },
    },
  }) => {
    return API.user.put(`/users/${userId}`, body);
  },

  /**
   * 회원 탈퇴
   * 별도의 파라미터 없음
   */
  withdraw: () => {
    return API.user.delete(`/users/withdraw`);
  },
};
