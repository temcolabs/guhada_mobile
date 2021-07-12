import getRangeSelectOptions from './getRangeSelectOptions';

describe('getRangeSelectOptions', () => {
  it('1~5 까지의 옵션', () => {
    const result = getRangeSelectOptions({
      start: 1,
      end: 5,
    });

    expect(result.length).toBe(5);
    expect(result.map(r => r.value).join(',')).toBe('1,2,3,4,5');
  });

  it('1~5 까지의 옵션, 내림차순 정렬', () => {
    const result = getRangeSelectOptions({
      start: 1,
      end: 5,
      sort: 'desc',
    });

    expect(result.length).toBe(5);
    expect(result.map(r => r.value).join(',')).toBe('5,4,3,2,1');
  });

  it('1~5 까지의 옵션, %VALUE%월 템플릿 적용', () => {
    const result = getRangeSelectOptions({
      start: 1,
      end: 5,
      template: '%VALUE%월',
    });

    expect(result.length).toBe(5);
    expect(result.map(r => r.label).join(',')).toBe('1월,2월,3월,4월,5월');
  });
});
