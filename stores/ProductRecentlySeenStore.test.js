import ProductRecentlySeenStore from './ProductRecentlySeenStore';
import key from 'constant/key';
import localStorage from 'lib/localStorage';

/**
 * mock storage
 */
function storageMock() {
  var storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      var keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
}

describe('ProductRecentlySeenStore (최근 본 상품)', () => {
  let store;
  const SAMPLE_ITEM = {
    // 제품 정보
    brandName: 'brandname',
    dealsId: 1111,
    desc: 'item desc',
    sellPrice: 10000,
    sellerId: 2222,
    sellerName: 'seller',
    season: 'FW',
    imageUrl: 'http://',
  };

  beforeEach(() => {
    global.localStorage = storageMock();
    global.window = global;
    localStorage.remove(key.PRODUCT_RECENTLY_SEEN);

    store = new ProductRecentlySeenStore({});
  });

  it('아이템 추가 테스트', () => {
    expect(store.list.length).toBe(0);

    store.addItem(SAMPLE_ITEM);
    expect(store.list.length).toBe(1);
    expect(store.list[0].dealsId).toBe(SAMPLE_ITEM.dealsId);
  });

  it('스토리지에서 아이템 가져오기', () => {
    store.addItem(SAMPLE_ITEM);

    const list = store.getListFromStorage();

    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(1);
    expect(list[0].dealsId).toBe(SAMPLE_ITEM.dealsId);
  });

  it('dealsId 아이디가 중복이면 추가되지 않아야 한다.', () => {
    store.addItem(SAMPLE_ITEM);
    store.addItem(SAMPLE_ITEM);
    expect(store.list.length).toBe(1);
  });

  it('스토리지에 저장되는 아이템 수는 최대 MAX_ITEM개이다. ', () => {
    for (let i = 0; i < 30; i++) {
      store.addItem(Object.assign({}, SAMPLE_ITEM, { dealsId: i }));
    }

    expect(store.list.length).toBe(store.MAX_ITEM);
  });

  it('아이템 삭제. dealsId를 사용해 제거한다.', () => {
    localStorage.set(key.PRODUCT_RECENTLY_SEEN, []);

    for (let i = 1; i <= 10; i++) {
      store.addItem(Object.assign({}, SAMPLE_ITEM, { dealsId: i }));
    }

    store.removeItem(5);
    store.removeItem(10);

    expect(store.list.length).toBe(8);
  });
});
