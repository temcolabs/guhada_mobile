import API from 'lib/API';
import detectDevice from 'lib/common/detectDevice';

export default {
  /**
   * 검색창 placeholder
   */
  getSearchPlaceholder: () => {
    const { isMobile } = detectDevice();
    return API.settle.get(`/selectMainData`, {
      params: {
        agent: isMobile ? 'MWEB' : 'WEB',
      },
    });
  },
};
