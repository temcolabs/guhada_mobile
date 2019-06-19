const sortAsc = (a, b) => a - b;
const sortDesc = (a, b) => b - a;

/**
 * Select 컴포넌트에 사용할 수 있도록 숫자를 값으로 가지는 객체 배열을 리턴한다.
 *
 * @param {*} option.start 시작
 * @param {*} option.end 종료
 * @param {*} option.sort  정렬. asc가 아니면 내림차순 정렬
 * @param {*} option.template 템플릿. %VALUE% 부분을 값으로 치환한다.
 */
export default function getRangeSelectOptions({
  start,
  end,
  sort = 'asc',
  template = `%VALUE%`,
}) {
  let options = [];
  for (let i = start; i <= end; i++) {
    options.push({
      value: i,
      label: template.replace(/%VALUE%/, i),
    });
  }

  const sortFunc = sort === 'asc' ? sortAsc : sortDesc;

  options = options.sort((a, b) => sortFunc(a.value, b.value));

  return options;
}
