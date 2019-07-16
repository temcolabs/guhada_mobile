const API = require('../../lib/API');

module.exports = {
  method: 'post',
  url: '/privyCertifyResult',

  handler: function(req, res) {
    const authData = req.body;
    console.log(req, authData, 'authData');
    if (authData.P_STATUS !== '00') {
      console.log(authData, 'authData123', authData.P_RMESG1, 'message');

      if (req.query.cartList && authData.P_RMESG1) {
        res.redirect(
          '/orderpayment?cartList=' +
            req.query.cartList +
            '&resultMsg=' +
            authData.P_RMESG1
        );
      } else {
        res.redirect('/');
      }

      return false;
    }

    API.order
      .post(
        `http://dev.order.guhada.com/order/orderApproval`,
        {
          resultCode: authData.P_STATUS,
          resultMsg: authData.P_RMESG1,
          // pgMid: authData.P_TID,
          // authToken: authData.authToken,
          // authUrl: authData.authUrl,
          // netCancel: authData.netCancelUrl,
          checkAckUrl: authData.P_REQ_URL,
          pgOid: authData.P_OID,
          pgTidSample: authData.P_TID,
          web: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(response => {
        let data = response.data.data;
        // console.log(response, 'response');
        if (response.data.resultCode === 200) {
          res.redirect('/orderpaymentsuccess?id=' + data);
        } else {
          console.log(data, 'pg 통과후 문제');

          if (req.query.cartList) {
            res.redirect('/orderpayment?cartList=' + req.query.cartList);
          } else {
            res.redirect('/');
          }
        }
      });

    // const data = {
    //   resultCode: authData.resultCode,
    //   resultMsg: authData.resultMsg,
    //   pgMid: authData.mid,
    //   authToken: authData.authToken,
    //   authUrl: authData.authUrl,
    //   netCancel: authData.netCancelUrl,
    //   checkAckUrl: authData.checkAckUrl,
    //   pgOid: authData.orderNumber,
    // };

    // API.order.post(`/order/orderApproval`, data).then(response => {
    //   let data = response.data.data;
    //   // console.log(response, 'response');
    //   if (response.data.resultCode === 200) {
    //     res.redirect('/orderpaymentsuccess?id=' + data);
    //   } else {
    //     console.log(data, 'pg 통과후 문제');
    //     res.redirect('/orderpayment?cartList=' + req.query.cartList);
    //   }
    // });
  },
};
