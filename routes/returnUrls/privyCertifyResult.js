const API = require('../../lib/API');

module.exports = {
  method: 'post',
  url: '/privyCertifyResult',
  handler: function(req, res) {
    const authData = req.body;

    if (authData.resultCode !== '0000') {
      console.log(authData, 'authData', authData.resultMsg, 'message');

      if (req.query.cartList && authData.resultMsg) {
        res.redirect(
          '/orderpayment?cartList=' +
            req.query.cartList +
            '&resultMsg=' +
            authData.resultMsg
        );
      } else {
        res.redirect('/');
      }

      return false;
    }

    API.order
      .post(
        `/order/orderApproval`,
        {
          resultCode: authData.resultCode,
          resultMsg: authData.resultMsg,
          pgMid: authData.mid,
          authToken: authData.authToken,
          authUrl: authData.authUrl,
          netCancel: authData.netCancelUrl,
          checkAckUrl: authData.checkAckUrl,
          pgOid: authData.orderNumber,
          web: true,
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
