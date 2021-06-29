export const enRegex = /[A-Z]/;
export const koRegex = /[ㄱ-ㅎ]/;
export const noRegex = { En: /[A-Z|a-z]/, Ko: /[가-힣]/ };

const koLetters = [
  'ㄱ',
  'ㄱ', // ㄲ
  'ㄴ',
  'ㄷ',
  'ㄷ', // ㄸ
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅂ', // ㅃ
  'ㅅ',
  'ㅅ', // ㅆ
  'ㅇ',
  'ㅈ',
  'ㅈ', // ㅉ
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];
/**
 * a helper to find the first korean consonant letter
 * consonants ㄲㄸㅃㅆㅉ are returned as ㄱㄷㅂㅅㅈ respectativley
 * @param {string} str
 * @returns {string|bool} returns false if `str` is not string or unfigurable
 */
export const findKoLetter = (str) => {
  if (typeof str === 'string') {
    for (let i = 0; i < str.length; ++i) {
      const code = str.charCodeAt(i) - 44032;
      if (-1 < code && code < 11172) {
        return koLetters[Math.floor(code / 588)];
      }
    }
  }
  return false;
};

/**
 * a helper to find the first engllish letter in uppercase
 * @param {string} str
 * @returns {string|bool} returns false if `str` is not string or unfigurable
 */
export const findEnLetter = (str) => {
  if (typeof str === 'string') {
    return str.charAt(0).toUpperCase();
  }
  return false;
};

export const sortFactory = {
  En: (a, b) => {
    return a.nameEnCap > b.nameEnCap ? 1 : -1;
  },
  Ko: (a, b) => {
    return a.nameKo > b.nameKo ? 1 : -1;
  },
};

export const reduceFactory = {
  En: (arr, curr) => {
    let firstLetter = findEnLetter(curr.nameEnCap);
    if (firstLetter) {
      if (!enRegex.test(firstLetter)) {
        firstLetter = 'No.';
      }
      if (arr.length === 0 || firstLetter !== arr[arr.length - 1][0]) {
        arr.push([firstLetter, curr]);
      } else {
        arr[arr.length - 1].push(curr);
      }
    }
    return arr;
  },
  Ko: (arr, curr) => {
    let firstLetter = findKoLetter(curr.nameKo);
    if (firstLetter) {
      if (!koRegex.test(firstLetter)) {
        firstLetter = 'No.';
      }
      if (arr.length === 0 || firstLetter !== arr[arr.length - 1][0]) {
        arr.push([firstLetter, curr]);
      } else {
        arr[arr.length - 1].push(curr);
      }
    }
    return arr;
  },
};
