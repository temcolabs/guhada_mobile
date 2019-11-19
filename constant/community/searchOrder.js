export const searchOrderOptions = [
  { label: '최신순', value: 'DATE_DESC' },
  { label: '조회순', value: 'VIEW_DESC' },
  // { label: '좋아요순', value: 'LIKE_DESC' }, // TODO: 좋아요 추가된 후 복구
  { label: '댓글순', value: 'COMMENT_DESC' },
  // { label: '오래된 순 ', value: 'DATE_ASC' },
  // { label: 'VIEW_ASC', value: 'VIEW_ASC' },
  // { label: 'LIKE_ASC', value: 'LIKE_ASC' },
  // { label: 'COMMENT_ASC', value: 'COMMENT_ASC' },
];

// enum 형식 객체 생성
const searchOrder = searchOrderOptions.reduce((result, option) => {
  result[option.value] = option.value;
  return result;
}, {});

/**
 * 검색 정렬 옵션
 */
export default searchOrder;
