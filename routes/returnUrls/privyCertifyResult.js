require('dotenv').config();
const API = require('../../childs/lib/API');

module.exports = {
  method: 'post',
  url: '/privyCertifyResult',

  handler: function(req, res) {
    console.log(`process.env.API_ORDER`, process.env.API_ORDER);

    const authData = req.body;
    let para = req.url;

    let oid = para.substring(para.indexOf('?') + 1, para.length);
    console.log(para, oid, authData);

    if (authData.P_STATUS !== '00') {
      console.log(authData, ' : authData', authData.P_RMESG1, ' : message');

      if (req.query.cartList && authData.P_RMESG1) {
        // res.redirect(
        //   '/orderpayment?cartList=' +
        //     req.query.cartList +
        //     '&resultMsg=' +
        //     authData.P_RMESG1
        // );
        res.redirect('/');
      } else {
        // res.redirect('/orderpayment?cartList=' + oid);
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
      // axios
      //   .post('http://qa.order.guhada.com/order/orderApproval', {
      //     resultCode: authData.P_STATUS,
      //     resultMsg: authData.P_RMESG1,
      //     checkAckUrl: authData.P_REQ_URL,
      //     pgOid: oid,
      //     pgTidSample: authData.P_TID,
      //     web: false,
      //   })
      .then(response => {
        let data = response.data.data;
        console.log('POST order/orderApproval response.data.data:', response);
        res.redirect('/orderpaymentsuccess?id=' + data);
      })
      .catch(err => {
        console.error(`privyCertifyResult err ${err}`);
        res.redirect('/');
      });
  },
};
