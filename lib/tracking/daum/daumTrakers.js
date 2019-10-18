export default {
  signup: () => {
    var DaumConversionDctSv = 'type=M,orderID=,amount=';
    var DaumConversionAccountID = 'PRV6.WiKKpak6Ml_rjmD1Q00';
    if (
      typeof DaumConversionScriptLoaded == 'undefined' &&
      location.protocol != 'file:'
    ) {
      var DaumConversionScriptLoaded = true;
      document.write(
        unescape(
          '%3Cscript%20type%3D%22text/javas' +
            'cript%22%20src%3D%22' +
            (location.protocol == 'https:' ? 'https' : 'http') +
            '%3A//t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js%22%3E%3C/script%3E'
        )
      );
    }
  },
  shoppingCart: () => {
    //<![CDATA[
    var DaumConversionDctSv = 'type=W,orderID=,amount=';
    var DaumConversionAccountID = 'PRV6.WiKKpak6Ml_rjmD1Q00';
    if (
      typeof DaumConversionScriptLoaded == 'undefined' &&
      location.protocol != 'file:'
    ) {
      var DaumConversionScriptLoaded = true;
      document.write(
        unescape(
          '%3Cscript%20type%3D%22text/javas' +
            'cript%22%20src%3D%22' +
            (location.protocol == 'https:' ? 'https' : 'http') +
            '%3A//t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js%22%3E%3C/script%3E'
        )
      );
    }
    //]]>
  },
  purchaseComplete: ({ orderID, amount }) => {
    var DaumConversionDctSv = 'type=P,orderID=,amount=';
    var DaumConversionAccountID = 'PRV6.WiKKpak6Ml_rjmD1Q00';
    if (
      typeof DaumConversionScriptLoaded == 'undefined' &&
      location.protocol != 'file:'
    ) {
      var DaumConversionScriptLoaded = true;
      document.write(
        unescape(
          '%3Cscript%20type%3D%22text/javas' +
            'cript%22%20src%3D%22' +
            (location.protocol == 'https:' ? 'https' : 'http') +
            '%3A//t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js%22%3E%3C/script%3E'
        )
      );
    }
  },
};
