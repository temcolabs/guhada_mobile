import { loadScript } from 'lib/dom';
export default {
  signup: function() {
    DaumConversionDctSv = 'type=M,orderID=,amount=';
    const daumtrackerUrl =
      typeof window == 'object'
        ? window.location.protocol == 'https:'
          ? 'https://t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js'
          : 'http://t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js'
        : '';

    loadScript(daumtrackerUrl, {
      id: 'daumtracker',
      onLoad: removeScript(),
    });
  },
  shoppingCart: function() {
    DaumConversionDctSv = 'type=W,orderID=,amount=';
    const daumtrackerUrl =
      typeof window == 'object'
        ? window.location.protocol == 'https:'
          ? 'https://t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js'
          : 'http://t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js'
        : '';

    loadScript(daumtrackerUrl, {
      id: 'daumtracker',
      onLoad: removeScript(),
    });
  },
  purchaseComplete: function({ orderID, amount }) {
    DaumConversionDctSv = 'type=P,orderID=' + orderID + ',amount=' + amount;
    const daumtrackerUrl =
      typeof window == 'object'
        ? window.location.protocol == 'https:'
          ? 'https://t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js'
          : 'http://t1.daumcdn.net/cssjs/common/cts/vr200/dcts.js'
        : '';

    loadScript(daumtrackerUrl, {
      id: 'daumtracker',
      onLoad: removeScript(),
    });
  },
};

const removeScript = () => {
  document.body.addEventListener('DOMNodeInserted', deleteScript);
};

const deleteScript = () => {
  let elem = document.getElementById('daumtracker');
  if (elem) {
    elem.parentNode.removeChild(elem);
  }
  document.body.removeEventListener('DOMNodeInserted', deleteScript);
};
