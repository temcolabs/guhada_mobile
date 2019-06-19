import { routesWithRegexp, findRoute } from './push';
const pathToRegexp = require('path-to-regexp');

describe('findRoute', () => {
  it('실제 파라미터 값이 포함된 url로 매칭되는 라우트 설정을 찾을 수 있다', () => {
    // routes 배열이 변경되면 테스트 케이스도 함께 수정해야 함
    const sampleUrl = '/mypage/orders/detail/3887';
    const matched = findRoute(sampleUrl);
    expect(matched).not.toBe(null);
  });

  it('쿼리스트링이 포함되어 있어도 찾을 수 있다', () => {
    // routes 배열이 변경되면 테스트 케이스도 함께 수정해야 함
    const sampleUrl = '/mypage/orders/detail/3887?page=1&';
    const matched = findRoute(sampleUrl);
    expect(matched).not.toBe(null);
  });
});

describe('pathToRegexp', () => {
  let route;
  let regexp;

  beforeAll(() => {
    route = '/mypage/orders/:purchaseId';
    regexp = pathToRegexp(route);
  });

  it('매칭되지 않으면 null이 리턴된다', () => {
    expect(regexp.exec(`/`)).toBe(null);
    expect(regexp.exec(`/mypage/orders/123/12345`)).toBe(null);
  });

  it('쿼리스트링도 파라미터의 연장으로 취급된다', () => {
    expect(regexp.exec(`/mypage/orders/123?test=abc`)[1]).toBe('123?test=abc');
    expect(regexp.exec(`/mypage/orders/123?test=abc/`)[1]).toBe('123?test=abc');
  });
});
