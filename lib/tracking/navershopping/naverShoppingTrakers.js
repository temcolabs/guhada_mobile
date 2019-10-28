export default {
  signup: () => {
    var _nasa = {};
    _nasa['cnv'] = wcs.cnv('2', '1'); // 전환유형, 전환가치 설정해야함. 설치매뉴얼 참고
    if (!wcs_add) var wcs_add = {};
    wcs_add['wa'] = 's_256ea496e0f6';
    if (!_nasa) var _nasa = {};
    wcs.inflow();
    wcs_do(_nasa);
  },
  shoppingCart: () => {
    var _nasa = {};
    _nasa['cnv'] = wcs.cnv('3', '1'); // 전환유형, 전환가치 설정해야함. 설치매뉴얼 참고
    if (!wcs_add) var wcs_add = {};
    wcs_add['wa'] = 's_256ea496e0f6';
    if (!_nasa) var _nasa = {};
    wcs.inflow();
    wcs_do(_nasa);
  },
  purchaseComplete: ({ price }) => {
    var _nasa = {};
    _nasa['cnv'] = wcs.cnv('1', price); // 전환유형, 전환가치 설정해야함. 설치매뉴얼 참고
    if (!wcs_add) var wcs_add = {};
    wcs_add['wa'] = 's_256ea496e0f6';
    if (!_nasa) var _nasa = {};
    wcs.inflow();
    wcs_do(_nasa);
  },
};
