export const searchTypeOptions = [
  {
    value: 'TITLE_CONTENTS',
    label: '제목+내용',
  },
  {
    value: 'CONTENTS',
    label: '내용',
  },
  {
    value: 'TITLE',
    label: '제목',
  },
  {
    value: 'COMMENTS',
    label: '댓글',
  },
  {
    value: 'BBS_WRITER',
    label: '작성자',
  },
  {
    value: 'COMMENT_WITTER',
    label: '댓글 작성자',
  },
];

// enum 형식
const searchType = searchTypeOptions.reduce((result, option) => {
  result[option.value] = option.value;
  return result;
}, {});

export default searchType;
