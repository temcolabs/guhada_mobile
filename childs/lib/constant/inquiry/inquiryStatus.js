/**
 * 문의 답변 상태
 */
const inquiryStatus = {
  ALL: '', // * 전체. 문의 목록 호출할 대 status에 공백 문자를 넣으면 전체 문의를 가져온다
  PENDING: 'PENDING', // 미답변
  COMPLETED: 'COMPLETED', // 답변 완료
};

export default inquiryStatus;
