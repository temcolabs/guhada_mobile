import API from 'lib/API';

export default {
  /**
   * 은행 정보 가져옴
   * ex) [{bankCode: "81", bankName: "하나은행", bankPriority: "10"}]
   */
  getBanks: () => {
    return API.user.get(`/banks`).then(({ data }) =>
      data?.data
        ?.sort((a, b) => b.priority - a.priority)
        .map(bank => ({
          label: bank.bankName,
          value: bank.bankCode,
          bankPriority: bank.bankPriority,
        }))
    );
  },
};
