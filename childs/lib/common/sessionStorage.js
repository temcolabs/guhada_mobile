const getSessionStorageItem = (name) => {
  if (typeof window === 'object') {
    const value = window.sessionStorage.getItem(name) || '';
    return !!value ? JSON.parse(value) : value;
  }
};

const setSessionStorageItem = (name, value) => {
  if (typeof window === 'object') {
    const stringifiedValue = JSON.stringify(value);
    window.sessionStorage.setItem(name, stringifiedValue);
  }
};

const removeSessionStorageItem = (name) => {
  if (typeof window === 'object') {
    window.sessionStorage.removeItem(name);
  }
};

/**
 * Returns the value of existing key in `number` type
 * @param {string} key
 */
const getIntSessionStorageItem = (key) => {
  if (typeof window === 'object') {
    const value = window.sessionStorage.getItem(key);
    return !!value ? parseInt(value) : NaN;
  }
  return NaN;
};

module.exports = {
  get: getSessionStorageItem,
  set: setSessionStorageItem,
  remove: removeSessionStorageItem,
  getInt: getIntSessionStorageItem,
};
