import isTruthy, { isFalsey } from './isTruthy';

describe('isTruthy', () => {
  it('number => true', () => {
    expect(isTruthy(123)).toBe(true);
  });

  it('Symbol => true', () => {
    expect(isTruthy(Symbol('unique'))).toBe(true);
  });

  it('null => false', () => {
    expect(isTruthy(null)).toBe(false);
  });

  it('undefined => false', () => {
    expect(isTruthy(undefined)).toBe(false);
  });

  it('[] => false', () => {
    expect(isTruthy([])).toBe(false);
  });

  it('empty string => false', () => {
    expect(isTruthy('')).toBe(false);
  });

  it('empty object => false', () => {
    expect(isTruthy({})).toBe(false);
  });
});

describe('isFalsey', () => {
  it('number => false', () => {
    expect(isFalsey(123)).toBe(false);
  });

  it('Symbol => false', () => {
    expect(isFalsey(Symbol('unique'))).toBe(false);
  });

  it('null => true', () => {
    expect(isFalsey(null)).toBe(true);
  });

  it('undefined => true', () => {
    expect(isFalsey(undefined)).toBe(true);
  });

  it('[] => true', () => {
    expect(isFalsey([])).toBe(true);
  });

  it('empty string => true', () => {
    expect(isFalsey('')).toBe(true);
  });

  it('empty object => true', () => {
    expect(isFalsey({})).toBe(true);
  });
});
