const API = require('../../lib/API');
let url = require('url');
const devLog = require('../../lib/devLog');
module.exports = {
  method: 'post',
  url: '/privyCertifyResult2',

  handler: function(req, res) {
    const authData = req.body;
    let para = req.url;

    let oid = para.substring(para.indexOf('?') + 1, para.length);
    devLog(para, oid, authData, ' oid , /privyCertifyResult2');

    if (authData.P_STATUS !== '00') {
      devLog(authData, 'authData', authData.P_RMESG1, 'message');

      if (req.query.cartList && authData.P_RMESG1) {
        res.redirect(
          '/orderpayment?cartList=' +
            req.query.cartList +
            '&resultMsg=' +
            authData.P_RMESG1
        );
      } else {
        res.redirect('/orderpayment?cartList=' + oid);
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
          pgOid: oid,
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
        devLog(response, 'response');
        res.redirect('/orderpaymentsuccess?id=' + data);
      })
      .catch(err => {
        if (err.status === 200) {
          console.error(`err message ${err}`);
          console.error(`pg 통과후 err ${err.data}`);
          if (req.query.cartList) {
            res.redirect('/orderpayment?cartList=' + req.query.cartList);
          } else {
            res.redirect('/orderpayment?oid=' + oid);
          }
        } else {
          console.error(err);
          res.redirect('/orderpayment?oid=' + oid);
          // res.redirect(
          //   `/orderpayment?cartList=${req.query.cartList}&resultMsg=${err}`
          // );
        }
      });
  },
};
