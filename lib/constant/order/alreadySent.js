import { arrayToEnum } from 'lib/common/arrayToObject';

export const alreadySent = {
  YES: {
    code: 'YES',
    label: '예',
  },
  NO: {
    code: 'NO',
    label: '아니오',
  },
};

export const alreadySentTypes = arrayToEnum(Object.keys(alreadySent));

export const alreadySentOptions = Object.keys(alreadySent).map((key) => {
  return {
    value: alreadySent[key].code,
    label: alreadySent[key].label,
  };
});
