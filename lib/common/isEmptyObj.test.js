import isEmptyObj from './isEmptyObj';

describe('isEmptyObj', () => {
  it('{} => true', () => {
    expect(isEmptyObj({})).toBe(true);
  });

  it('not emtpy object => false', () => {
    expect(isEmptyObj({ a: 1 })).toBe(false);
    expect(isEmptyObj({ a: undefined })).toBe(false);
  });

  it('primitive values => false', () => {
    expect(isEmptyObj(1)).toBe(false);
    expect(isEmptyObj(true)).toBe(false);
    expect(isEmptyObj(false)).toBe(false);
    expect(isEmptyObj(null)).toBe(false);
    expect(isEmptyObj(undefined)).toBe(false);
  });
});
