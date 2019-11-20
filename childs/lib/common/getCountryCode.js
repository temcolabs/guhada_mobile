const axios = require('axios');
const debouncePromise = require('./debouncePromise');

module.exports = debouncePromise(() => {
  return axios
    .request({
      url: 'https://extreme-ip-lookup.com/json/',
      method: 'get',
      timeout: 1000,
    })
  .then(res => {
      const { data } = res;
      const countryCode = data.countryCode;
      return countryCode;
    })
    .catch(e => {
      console.error(e);
      return null;
    });
}, 200);
