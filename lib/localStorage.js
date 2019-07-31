const canUseLocalStorage = typeof window === 'object' && !!window.localStorage;

module.exports = {
  /**
   * 키, 값, 유효기간(분). 유효기간 기본값은 30일
   */
  set: (key = '', value, expirationMin = 43200) => {
    if (canUseLocalStorage) {
      const expirationMS = expirationMin * 60 * 1000;
      const record = {
        value: JSON.stringify(value),
        timestamp: +new Date() + expirationMS,
      };

      localStorage.setItem(key, JSON.stringify(record));
    }
  },
  get: (key = '') => {
    if (canUseLocalStorage) {
      const record = JSON.parse(localStorage.getItem(key));

      if (!record) {
        return undefined;
      }

      return +new Date() < record.timestamp && JSON.parse(record.value);
    }
  },
  remove: (key = '') => {
    if (canUseLocalStorage) {
      window.localStorage.removeItem(key);
    }
  },
};
