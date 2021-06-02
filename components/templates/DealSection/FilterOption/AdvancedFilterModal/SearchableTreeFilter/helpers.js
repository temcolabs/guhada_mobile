import findChoKorean from 'childs/lib/common/findChoKorean';

const enRegex = /[A-Z]/;
const koRegex = /[ㄱ-ㅎ]/;
const noRegex = { En: /[A-Z|a-z]/, Ko: /[가-힣]/ };

export const sortFactory = (code) => {
  const prop = `name${code}`;
  return (a, b) => {
    if (!noRegex[code].test(b[prop].charAt(0))) {
      if (!noRegex[code].test(a[prop].charAt(0))) {
        return a[prop] > b[prop] ? 1 : -1;
      }
      return -1;
    }
    return a[prop] > b[prop] ? 1 : -1;
  };
};

export const enReduceFactory = (arr, curr) => {
  let firstLetter = curr.nameEn.substring(0, 1).toUpperCase();
  if (!enRegex.test(firstLetter)) {
    firstLetter = 'No.';
  }
  if (arr.length === 0 || firstLetter !== arr[arr.length - 1][0]) {
    arr.push([firstLetter, curr]);
  } else {
    arr[arr.length - 1].push(curr);
  }
  return arr;
};

export const koReduceFactory = (arr, curr) => {
  let firstLetter = findChoKorean(curr.nameKo);
  if (!koRegex.test(firstLetter)) {
    firstLetter = 'No.';
  }
  if (arr.length === 0 || firstLetter !== arr[arr.length - 1][0]) {
    arr.push([firstLetter, curr]);
  } else {
    arr[arr.length - 1].push(curr);
  }
  return arr;
};
