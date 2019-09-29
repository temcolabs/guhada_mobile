const API = require('../../lib/API');

module.exports = {
  method: 'post',
  url: '/privyCertifyResult',

  handler: function(req, res) {
    const authData = req.body;
    console.log(
      authData.P_OID,
      req.query.oid,
      authData,
      'authData.P_OID , authData'
    );
    if (authData.P_STATUS !== '00') {
      console.log(authData, 'authData', authData.P_RMESG1, 'message');

      if (req.query.cartList && authData.P_RMESG1) {
        res.redirect(
          '/orderpayment?cartList=' +
            req.query.cartList +
            '&resultMsg=' +
            authData.P_RMESG1
        );
      } else {
        res.redirect('/orderpayment?cartList=' + req.query.oid);
      }

      return false;
    }

    API.order
      .post(
        `/order/orderApproval`,
        {
          resultCode: authData.P_STATUS,
          resultMsg: authData.P_RMESG1,
          // pgMid: authData.P_TID,
          // authToken: authData.authToken,
          // authUrl: authData.authUrl,
          // netCancel: authData.netCancelUrl,
          checkAckUrl: authData.P_REQ_URL,
          pgOid: req.query.oid,
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
        console.log(response, 'response');
        res.redirect('/orderpaymentsuccess?id=' + data);
      })
      .catch(err => {
        if (err.status === 200) {
          console.error(`err message ${err}`);
          console.error(`pg 통과후 err ${err.data}`);
          if (req.query.cartList) {
            res.redirect('/orderpayment?cartList=' + req.query.cartList);
          } else {
            res.redirect('/orderpayment?oid=' + req.query.oid);
          }
        } else {
          console.error(err);
          res.redirect(
            `/orderpayment?cartList=${req.query.cartList}&resultMsg=${err}`
          );
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
