const brandNew = {
  NEW: '새제품',
  USED: '빈티지',
};

export const brandNewOptions = Object.keys(brandNew).map(key => {
  const brand = brandNew[key];
  return {
    value: key,
    label: brand,
  };
});
export default brandNew;
