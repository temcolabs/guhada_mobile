const internationalShipping = {
  INTERNATIONAL: '해외배송',
  NATIONAL: '국내배송',
};

export const internationalShippingOptions = Object.keys(
  internationalShipping
).map(key => {
  const shipping = internationalShipping[key];
  return {
    value: key,
    label: shipping,
  };
});

export default internationalShipping;
