require('dotenv').config();
const API = require('../../childs/lib/API');

module.exports = {
  method: 'post',
  url: '/privyCertifyResult',

  handler: function(req, res) {
    const authData = req.body;
    let para = req.url;
    let oid = para.substring(para.indexOf('?') + 1, para.lastIndexOf('?'));
    let cartList = para.substring(para.indexOf('=') + 1, para.length);
    console.log(authData, 'authData');
    if (authData.P_STATUS !== '00') {
      if (cartList) {
        res.redirect(
          '/orderpayment?cartList=' +
            cartList +
            '&resultMsg=' +
            authData.P_RMESG1
        );
      } else {
        res.redirect('/');
      }

      return false;
    }

    API.order
      .post('/order/orderApproval', {
        resultCode: authData.P_STATUS,
        resultMsg: authData.P_RMESG1,
        // pgMid: authData.P_TID,
        // authToken: authData.authToken,
        // authUrl: authData.authUrl,
        // netCancel: authData.netCancelUrl,
        checkAckUrl: authData.P_REQ_URL,
        pgOid: oid,
        pgTidSample: authData.P_TID,
        web: false,
      })
      .then(response => {
        let data = response.data.data;
        console.log('POST order/orderApproval response.data.data:', response);
        res.redirect('/orderpaymentsuccess?id=' + data);
      })
      .catch(err => {
        console.error(`privyCertifyResult err ${err}`);
        res.redirect(
          '/orderpayment?cartList=' +
            cartList +
            '&resultMsg=' +
            authData.P_RMESG1
        );
      });
  },
};
