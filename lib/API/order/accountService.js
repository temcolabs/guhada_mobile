import API from 'lib/API';

export default {
  /**
   * 계좌 확인
   * 은행 코드는 getBanks를 통해 가져온 데이터와 일치해야 한다
   *
   * 리퀘스트 성공 후 응답 데이터의 result 필드 값으로 결과를 확인해야 함.
   *
   * @param option.bankCode 은행 코드
   * @param option.bankNumber 계좌번호
   * @param option.name 계좌주 이름
   */
  accountCheck: ({ bankCode, bankNumber, name }) => {
    return API.order.post(`/accountCheck`, {
      bankCode,
      bankNumber,
      name,
    });
  },
};
