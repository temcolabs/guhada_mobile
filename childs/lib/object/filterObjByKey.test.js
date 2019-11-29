import filterObjByKey from './filterObjByKey';

describe('filterObjByKey function', () => {
  it('객체에서 지정된 키만 남아야 한다', () => {
    expect(filterObjByKey({ a: 1, b: 1 }, ['a'])).toEqual({ a: 1 });
  });
});
