const API = require('../../lib/API');

module.exports = {
  method: 'post',
  url: '/privyCertifyResult2',

  handler: function(req, res) {
    const authData = req.body;
    console.log(
      authData.P_OID,
      req.query.oid,
      authData,
      'authData.P_OID , authData'
    );
  },
};
