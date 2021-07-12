import padZeroToSingleDigit from './padZeroToSingleDigit';

describe('padZeroToSingleDigit', () => {
  it('10보다 작은 숫자 앞에 0을 붙인다', () => {
    expect(padZeroToSingleDigit(5)).toBe('05');
    expect(padZeroToSingleDigit(1)).toBe('01');
    expect(padZeroToSingleDigit(0)).toBe('00');
  });

  it('0~9 외의 숫자는 그대로 리턴한다', () => {
    expect(padZeroToSingleDigit(99)).toBe(99);
    expect(padZeroToSingleDigit(-5)).toBe(-5);
  });

  it('NaN은 처리하지 않는다', () => {
    expect(padZeroToSingleDigit('a')).toBe('a');
    expect(padZeroToSingleDigit({})).toEqual({});
  });
});
