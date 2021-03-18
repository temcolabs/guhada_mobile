require('dotenv').config();
const API = require('../../childs/lib/API');

module.exports = {
  method: 'post',
  url: '/chargePointResult',
  handler: function(req, res) {
    const authData = req.body;

    if (authData.resultCode !== '0000') {
      res.redirect('/mypage/point?resultMsg=' + authData.resultMsg);
      return false;
    }

    API.order
      .post(
        '/payment/payment-point-approval',
        {
          acntTxtype: authData.acntTxtype,
          authId: authData.authId,
          authToken: authData.authToken,
          authUrl: authData.authUrl,
          billid: authData.billid,
          cardNo: authData.cardNo,
          cardQuota: authData.cardQuota,
          cashYn: authData.cashYn,
          cavv: authData.cavv,
          checkAckUrl: authData.checkAckUrl,
          cno: authData.cno,
          eci: authData.eci,
          isPoint: authData.isPoint,
          kftcSerialno: authData.kftcSerialno,
          kvpCardcode: authData.kvpCardcode,
          kvpEncdata: authData.kvpEncdata,
          kvpNoint: authData.kvpNoint,
          kvpPgid: authData.kvpPgid,
          kvpQuota: authData.kvpQuota,
          kvpSessionKey: authData.kvpSessionKey,
          methodCd: authData.methodCd,
          mid: authData.mid,
          mobileCd: authData.mobileCd,
          mobileNo: authData.mobileNo,
          netCancel: authData.netCancel,
          parentMethodCd: authData.parentMethodCd,
          pgAmount: authData.pgAmount,
          pgKind: authData.pgKind,
          pgMid: authData.pgMid,
          pgOid: authData.pgOid,
          pgTid: authData.pgTid,
          pgTidSample: authData.pgTidSample,
          prodNm: authData.prodNm,
          productAmt: authData.productAmt,
          purchaseEmail: authData.purchaseEmail,
          purchaseNm: authData.purchaseNm,
          purchasePhone: authData.purchasePhone,
          reqType: authData.reqType,
          resultCode: authData.resultCode,
          resultMsg: authData.resultMsg,
          returnUrl: authData.returnUrl,
          trCd: authData.trCd,
          vacctExprDate: authData.vacctExprDate,
          vacctExprTime: authData.vacctExprTime,
          web: true,
          xid: authData.xid,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then(response => {
        let data = response.data.data;

        if (response.data.resultCode === 200) {
          res.redirect('/mypage/point?resultMsg=chargesuccess');
        } else {
          res.redirect('/mypage/point');
        }
      });
  },
};
