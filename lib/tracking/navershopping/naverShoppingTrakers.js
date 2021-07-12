import detectDevice from 'lib/common/detectDevice';

const DESKTOP_WA = 's_57744e5ca3ee';
const MOBILE_WA = 's_256ea496e0f6';

export default {
  signup: () => {
    const { isMobile } = detectDevice();
    const WA_CODE = isMobile ? MOBILE_WA : DESKTOP_WA;

    var _nasa = {};
    _nasa['cnv'] = wcs.cnv('2', '1'); // 전환유형, 전환가치 설정해야함. 설치매뉴얼 참고
    if (!wcs_add) var wcs_add = {};
    wcs_add['wa'] = WA_CODE;
    if (!_nasa) var _nasa = {};
    wcs.inflow();
    wcs_do(_nasa);
  },
  shoppingCart: () => {
    const { isMobile } = detectDevice();
    const WA_CODE = isMobile ? MOBILE_WA : DESKTOP_WA;

    var _nasa = {};
    _nasa['cnv'] = wcs.cnv('3', '1'); // 전환유형, 전환가치 설정해야함. 설치매뉴얼 참고
    if (!wcs_add) var wcs_add = {};
    wcs_add['wa'] = WA_CODE;
    if (!_nasa) var _nasa = {};
    wcs.inflow();
    wcs_do(_nasa);
  },
  purchaseComplete: ({ price }) => {
    const { isMobile } = detectDevice();
    const WA_CODE = isMobile ? MOBILE_WA : DESKTOP_WA;

    var _nasa = {};
    _nasa['cnv'] = wcs.cnv('1', price); // 전환유형, 전환가치 설정해야함. 설치매뉴얼 참고
    if (!wcs_add) var wcs_add = {};
    wcs_add['wa'] = WA_CODE;
    if (!_nasa) var _nasa = {};
    wcs.inflow();
    wcs_do(_nasa);
  },
};
