const axios = require('axios');
const debouncePromise = require('./debouncePromise');

module.exports = debouncePromise(() => {
  return axios
    .request({
      // url: 'https://extreme-ip-lookup.com/json/',
      url: 'https://ip2c.org/self',
      method: 'get',
      timeout: 1000,
    })
    .then(res => {
      const { data } = res;
      const countryCode = data.split(';')[1];
      // const countryCode = data.countryCode;
      return countryCode;
    })
    .catch(e => {
      console.error(e);
      return null;
    });
}, 200);
